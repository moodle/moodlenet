import {
  binderDispatcher,
  domainAccess,
  moduleCore,
  moodleModuleName,
  secondaryAdapter,
  secondaryProvider,
  sys_admin_info,
} from '@moodle/domain'
import {
  accessDomain,
  configuration,
  createMoodleDomainProxy,
  deploymentInfoFromUrlString,
  getProxyFnPath,
  startBackgroundProcesses,
} from '@moodle/domain/lib'
import { getDomainFsDirectories, MOODLE_DEFAULT_HOME_DIR } from '@moodle/lib-domain-fs'
import { provideQueueService, queueService } from '@moodle/lib-job-queue-service'
import { getDefaultLocalFsStorageDirectory } from '@moodle/lib-storage-local-fs'
import { _any, date_time_string, email_address_schema, map, url_string_schema } from '@moodle/lib-types'
import { edu_core } from '@moodle/module/edu/core'
import { moodlenet_react_app_core } from '@moodle/module/moodlenet-react-app/core'
import { moodlenet_core } from '@moodle/module/moodlenet/core'
import { org_core } from '@moodle/module/org/core'
import { storage_core } from '@moodle/module/storage/core'
import { userAccount_core } from '@moodle/module/user-account/core'
import { user_profile_core } from '@moodle/module/user-profile/core'
import { cryptoDefaultEnv, get_default_crypto_secondarys_factory, provideCryptoDefaultEnv } from '@moodle/sec-crypto-default'
import {
  ArangoDbSecEnv,
  get_arango_persistence_factory,
  provideArangoDbSecEnv,
  provideArangoQueueServiceWorkers,
} from '@moodle/sec-db-arango'
import { migrateArangoDB } from '@moodle/sec-db-arango/migrate'
import { get_nodemailer_secondary_factory, NodemailerSecEnv, provideNodemailerSecEnv } from '@moodle/sec-email-nodemailer'
import { get_storage_default_secondary_factory, StorageDefaultSecEnv } from '@moodle/sec-storage-local-fs'
import assert from 'assert'
import dotenv from 'dotenv'
import { expand as dotenvExpand } from 'dotenv-expand'
import { readFileSync } from 'fs'
import { executionOutcome } from 'lib/job-queue/service/src/lib/types'
import * as path from 'path'
import { coerce, literal, object, union } from 'zod'
import { createWinstonDomainLoggerProvider, winstonLoggerConfigs } from './winston-logger'
// import {
//   get_default_resource_ingestion_secondary_factory,
//   provideDefaultResourceIngestorSecEnv,
// } from '@moodle/sec-resource-ingestion-default'
// import { resource_ingestion_core } from '@moodle/module/resource-ingestion/core'

const cache: map<Promise<configuratorResult>> = {}
type configuratorResult = {
  configuration: configuration
  loopbackDispatcher: binderDispatcher
  stopAndDrain: () => Promise<void>
}

export async function configuratorDrain() {
  const configs = await Promise.all(Object.values(cache))
  return Promise.allSettled(configs.map(({ stopAndDrain }) => stopAndDrain()))
}

export async function configurator({ domainName }: { domainName: string }) {
  // const normalized_domain = domainName.split(':')[0]!.replace(/:/g, '_')
  if (!cache[domainName]) {
    cache[domainName] = new Promise<configuratorResult>(resolveConfigurationPromise => {
      const MOODLE_HOME_DIR = path.resolve(process.cwd(), process.env.MOODLE_HOME_DIR ?? MOODLE_DEFAULT_HOME_DIR)
      const domainFsDirectories = getDomainFsDirectories({
        homeDir: MOODLE_HOME_DIR,
        domainName,
      })
      const loggerConfigs: winstonLoggerConfigs = { consoleLevel: 'debug' }

      dotenvExpand(dotenv.config({ path: path.join(domainFsDirectories.currentDomainDir, '.env'), override: true }))
      console.debug({ currentDomainDir: domainFsDirectories.currentDomainDir, MOODLE_HOME_DIR })

      const { loggerProvider } = createWinstonDomainLoggerProvider({ loggerConfigs })

      const isDev = process.env.NODE_ENV === 'development'

      const env = object({
        MOODLE_TEMP_FILE_MAX_RETENTION_SECONDS: coerce.number().default(60),
        MOODLE_CORE_INIT_BACKGROUND_PROCESSES: union([literal('true'), literal('false')]).optional(),
        MOODLE_SYS_ADMIN_EMAIL: email_address_schema,
        MOODLE_NET_WEBAPP_DEPLOYMENT_URL: url_string_schema,
        MOODLE_FILE_SERVER_DEPLOYMENT_URL: url_string_schema,
      }).parse({
        MOODLE_TEMP_FILE_MAX_RETENTION_SECONDS: process.env.MOODLE_TEMP_FILE_MAX_RETENTION_SECONDS,
        MOODLE_CORE_INIT_BACKGROUND_PROCESSES: process.env.MOODLE_CORE_INIT_BACKGROUND_PROCESSES,
        MOODLE_SYS_ADMIN_EMAIL: process.env.MOODLE_SYS_ADMIN_EMAIL,
        MOODLE_NET_WEBAPP_DEPLOYMENT_URL: process.env.MOODLE_NET_WEBAPP_DEPLOYMENT_URL,
        MOODLE_FILE_SERVER_DEPLOYMENT_URL: process.env.MOODLE_FILE_SERVER_DEPLOYMENT_URL,
      })

      console.info(`configuring domain [${domainName}] env:`, { MOODLE_HOME_DIR, ...env })
      const MOODLE_CRYPTO_PRIVATE_KEY = readFileSync(path.join(domainFsDirectories.currentDomainDir, `private.key`), 'utf8')
      const MOODLE_CRYPTO_PUBLIC_KEY = readFileSync(path.join(domainFsDirectories.currentDomainDir, `public.key`), 'utf8')
      const _process_env = process.env as _any

      const arango_db_env: ArangoDbSecEnv = provideArangoDbSecEnv({
        env: {
          ..._process_env,
          MOODLE_ARANGODB_ISDEV: `${isDev}`,
          MOODLE_ARANGODB_DOMAIN_NAME: domainName,
        },
      })
      const crypto_env: cryptoDefaultEnv = provideCryptoDefaultEnv({
        env: { ..._process_env, MOODLE_CRYPTO_PRIVATE_KEY, MOODLE_CRYPTO_PUBLIC_KEY },
      })
      const nodemailer_env: NodemailerSecEnv = provideNodemailerSecEnv({
        env: _process_env,
      })
      const sys_admin_info: sys_admin_info = {
        email: env.MOODLE_SYS_ADMIN_EMAIL,
      }
      const localFsStorageDirectory = getDefaultLocalFsStorageDirectory({ domainFsDirectories })
      const file_system_storage_sec_env: StorageDefaultSecEnv = {
        localFsStorageDirectory,
      }
      // const default_resource_ingestor_env = provideDefaultResourceIngestorSecEnv({ env: _process_env })
      const arango_persistence = get_arango_persistence_factory(arango_db_env)
      const secondaryProviders: secondaryProvider[] = [
        // sec modules
        arango_persistence.secondaryProvider,
        get_default_crypto_secondarys_factory(crypto_env),
        get_nodemailer_secondary_factory(nodemailer_env),
        get_storage_default_secondary_factory(file_system_storage_sec_env),
        (/* secondaryContext */) => {
          const secondaryAdapter: secondaryAdapter = {
            env: {
              query: {
                async deployments() {
                  return {
                    moodlenetWebapp: deploymentInfoFromUrlString(env.MOODLE_NET_WEBAPP_DEPLOYMENT_URL),
                    filestoreHttp: deploymentInfoFromUrlString(env.MOODLE_FILE_SERVER_DEPLOYMENT_URL),
                  }
                },
                async getSysAdminInfo() {
                  return sys_admin_info
                },
              },
            },
          }
          return secondaryAdapter
        },
        // get_default_resource_ingestion_secondary_factory(default_resource_ingestor_env),
      ]

      const moduleCores: moduleCore<_any>[] = [
        // core modules
        moodlenet_core,
        org_core,
        edu_core,
        userAccount_core,
        moodlenet_react_app_core,
        user_profile_core,
        storage_core,
        // resource_ingestion_core,
        {
          moduleName: 'env',
          service() {
            return
          },
          primary(/* ctx */) {
            return {
              async domain() {
                return {
                  async info() {
                    return { name: domainName }
                  },
                }
              },
              async application() {
                return {
                  async deployments() {
                    return {
                      moodlenetWebapp: deploymentInfoFromUrlString(env.MOODLE_NET_WEBAPP_DEPLOYMENT_URL),
                      filestoreHttp: deploymentInfoFromUrlString(env.MOODLE_FILE_SERVER_DEPLOYMENT_URL),
                    }
                  },
                }
              },
            }
          },
        },
      ]
      const configuration: configuration = {
        moduleCores,
        secondaryProviders,
        loggerProvider,
        domain: domainName,
        domainFsDirectories,
      }
      const pendingPromises: Promise<unknown>[] = []

      type jobData = { domainAccess: domainAccess }

      const arangoQueueServiceWorkers = provideArangoQueueServiceWorkers({ dbStruct: arango_persistence.dbStruct })
      const _queue_moodleDomain_proxy = createMoodleDomainProxy({ ctrl: async () => null })
      const getJobName = (path: string[]) => path.join('.')

      const queueServices = [_queue_moodleDomain_proxy.secondary.userNotification.service.sendMessageToUser].reduce<
        map<queueService<jobData>>
      >((_, proxyFn) => {
        const path = getProxyFnPath(proxyFn)
        const jobName = getJobName(path)

        return {
          ..._,
          [jobName]: provideQueueService<jobData>({
            workers: arangoQueueServiceWorkers,
            async executeJob({ job: { executionOutcomes, jobData } }) {
              if (executionOutcomes.length > 2) {
                return {
                  result: 'failed',
                  reason: 'applicative',
                  date: date_time_string('now'),
                  details: 'Too many retries',
                  followUp: {
                    action: 'abort',
                  },
                }
              }
              return loopbackDispatcher({ domainAccess: { ...jobData.domainAccess, enqueue: false } })
                .then<executionOutcome>(outcome => ({
                  result: 'done',
                  outcome,
                  date: date_time_string('now'),
                }))
                .catch<executionOutcome>(error => ({
                  result: 'failed',
                  reason: 'unhandledError',
                  date: date_time_string('now'),
                  error,
                }))
            },
            jobConfig: {
              jobName,
              parallelism: 3,
              progressTimeoutSecs: 30,
              emptyQueueRescheduleSecs: 30,
            },
          }),
        }
      }, {})

      const loopbackDispatcher: binderDispatcher = async ({ domainAccess }) => {
        if (domainAccess.enqueue) {
          const jobName = getJobName(domainAccess.endpoint)
          const jobId = domainAccess.callerContext?.ctxId
          assert(jobId, 'domainAccess must have a callerContext for enqueuing a message')
          const queueService = queueServices[jobName]
          assert(queueService, `queueService for jobName [${jobName}] not found`)
          await queueService.enqueue({ jobId, enqueueDate: date_time_string('now'), jobData: { domainAccess } })
          return
        }
        const accessResultPromise = accessDomain({ domainAccess, configuration, loopbackDispatcher })
        pendingPromises.push(accessResultPromise)
        accessResultPromise.finally(() => pendingPromises.splice(pendingPromises.indexOf(accessResultPromise), 1))
        return accessResultPromise
        // return shortCircuitLoopbackDispatcher({ configuration, domainAccess })
      }

      const background_process_promise =
        env.MOODLE_CORE_INIT_BACKGROUND_PROCESSES === 'true'
          ? migrateArangoDB({
              databaseConnections: arango_db_env.database_connections,
              log: loggerProvider({
                domain: domainName,
                contextLayer: 'secondary',
                id: 'migration',
                moduleName: 'sec-arangodb' as moodleModuleName,
              }),
            })
              .then(() =>
                startBackgroundProcesses({
                  configuration,
                  loopbackDispatcher,
                }),
              )
              .then(() =>
                Promise.all(
                  Object.entries(queueServices).map(([jobName, { startProcesses }]) =>
                    startProcesses({
                      onError: context => error => {
                        console.error(`queue service error [${jobName}]`, { context, error })
                      },
                    }),
                  ),
                ),
              )
          : Promise.resolve()
      background_process_promise.then(() => {
        resolveConfigurationPromise({ configuration, loopbackDispatcher, stopAndDrain })
      })
      async function stopAndDrain() {
        console.log(`draining [#${pendingPromises.length}] pending replies ...`)
        await Promise.allSettled([
          ...Object.values(queueServices).map(({ stopAndDrain }) => stopAndDrain()),
          ...pendingPromises,
        ])
        console.log('drained pending replies')
      }
    }).catch(e => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete cache[domainName]
      throw e
    })
  }

  return cache[domainName]
}
