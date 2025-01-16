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
import { _any, email_address_schema, map, url_string_schema } from '@moodle/lib-types'
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
import moment from 'moment'
import * as path from 'path'
import { coerce, literal, object, union } from 'zod'
import { createWinstonDomainLoggerProvider, winstonLoggerConfigs } from './winston-logger'
import { appDeployments } from 'domain/src/modules/env'
import {
  get_default_resource_ingestion_secondary_factory,
  provideDefaultResourceIngestorSecEnv,
} from '@moodle/sec-resource-ingestion-default'
import { resource_ingestion_core } from '@moodle/module/resource-ingestion/core'
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
      const domain_process_env = process.env as _any

      const arango_db_env: ArangoDbSecEnv = provideArangoDbSecEnv({
        env: {
          ...domain_process_env,
          MOODLE_ARANGODB_ISDEV: `${isDev}`,
          MOODLE_ARANGODB_DOMAIN_NAME: domainName,
        },
      })
      const crypto_env: cryptoDefaultEnv = provideCryptoDefaultEnv({
        env: { ...domain_process_env, MOODLE_CRYPTO_PRIVATE_KEY, MOODLE_CRYPTO_PUBLIC_KEY },
      })
      const nodemailer_env: NodemailerSecEnv = provideNodemailerSecEnv({
        env: domain_process_env,
      })
      const sys_admin_info: sys_admin_info = {
        email: env.MOODLE_SYS_ADMIN_EMAIL,
      }
      const localFsStorageDirectory = getDefaultLocalFsStorageDirectory({ domainFsDirectories })
      const file_system_storage_sec_env: StorageDefaultSecEnv = {
        localFsStorageDirectory,
      }

      const appDeployments: appDeployments = {
        moodlenetWebapp: deploymentInfoFromUrlString(env.MOODLE_NET_WEBAPP_DEPLOYMENT_URL),
        filestoreHttp: deploymentInfoFromUrlString(env.MOODLE_FILE_SERVER_DEPLOYMENT_URL),
      }
      const default_resource_ingestor_env = provideDefaultResourceIngestorSecEnv({ env: domain_process_env })
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
                  return appDeployments
                },
                async getSysAdminInfo() {
                  return sys_admin_info
                },
              },
            },
          }
          return secondaryAdapter
        },
        get_default_resource_ingestion_secondary_factory(default_resource_ingestor_env),
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
        resource_ingestion_core,
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
                    return appDeployments
                  },
                }
              },
            }
          },
        } satisfies moduleCore<'env'>,
      ]
      const configuration: configuration = {
        moduleCores,
        secondaryProviders,
        loggerProvider,
        domain: domainName,
        domainFsDirectories,
      }
      const pendingAccessResultPromises: Promise<unknown>[] = []

      type jobData = { domainAccess: domainAccess }

      const arangoQueueServiceWorkers = provideArangoQueueServiceWorkers({ dbStruct: arango_persistence.dbStruct })
      const _queue_moodleDomain_proxy = createMoodleDomainProxy({ ctrl: async () => null })
      const getJobName = (path: string[]) => path.join('.')

      const shortcircuitLoopbackDispatcher: binderDispatcher = async ({ domainAccess }) => {
        if (domainAccess.enqueue) {
          const jobName = getJobName(domainAccess.endpoint)
          const jobId = domainAccess.callerContext?.ctxId
          assert(jobId, 'domainAccess must have a callerContext for enqueuing a message')
          const queueService = queueServices[jobName]
          assert(queueService, `queueService for jobName [${jobName}] not found`)
          await queueService.enqueue({ jobId, enqueueDate: new Date().toISOString(), jobData: { domainAccess } })
          return
        }
        const accessResultPromise = accessDomain({
          domainAccess,
          configuration,
          loopbackDispatcher: shortcircuitLoopbackDispatcher,
        })
        pendingAccessResultPromises.push(accessResultPromise)
        accessResultPromise.finally(() =>
          pendingAccessResultPromises.splice(pendingAccessResultPromises.indexOf(accessResultPromise), 1),
        )
        return accessResultPromise
        // return shortCircuitLoopbackDispatcher({ configuration, domainAccess })
      }

      const queueServices = [
        _queue_moodleDomain_proxy.secondary.userNotification.service.sendMessageToUser,
        _queue_moodleDomain_proxy.secondary.resourceIngestion.write.ingestResource,
      ].reduce<map<queueService<jobData>>>((_, proxyFn) => {
        const path = getProxyFnPath(proxyFn)
        const jobName = getJobName(path)
        // const jobIs = {
        //   sendMessageToUser: proxyFn === _queue_moodleDomain_proxy.secondary.userNotification.service.sendMessageToUser,
        //   ingestResource: proxyFn === _queue_moodleDomain_proxy.secondary.resourceIngestion.write.ingestResource,
        // }

        const queueService = provideQueueService<jobData>({
          workers: arangoQueueServiceWorkers,
          async executeJob({
            job: {
              executionOutcomes,
              jobData: { domainAccess },
            },
          }) {
            return shortcircuitLoopbackDispatcher({ domainAccess: { ...domainAccess, enqueue: false } })
              .then<executionOutcome>(outcome => ({
                result: 'done',
                outcome,
                date: new Date().toISOString(),
              }))
              .catch<executionOutcome>(error => ({
                result: 'failed',
                reason: 'unhandledError',
                date: new Date().toISOString(),
                error,
                followUp:
                  executionOutcomes.length > 2
                    ? {
                        action: 'abort',
                        details: 'Too many retries',
                      }
                    : {
                        action: 'retry',
                        fromDate: moment().add(5, 'seconds').toISOString(),
                      },
              }))
          },
          jobConfig: {
            jobName,
            parallelism: 1,
            progressTimeoutSecs: 30,
            emptyQueueRescheduleSecs: 30,
          },
        })

        queueService.serviceEmitter.on('error', (context, error) => {
          console.error(`queue service error [${jobName}]`, { context, error })
        })

        return {
          ..._,
          [jobName]: queueService,
        }
      }, {})

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
                  loopbackDispatcher: shortcircuitLoopbackDispatcher,
                }),
              )
              .then(() => Promise.all(Object.values(queueServices).map(({ startProcesses }) => startProcesses())))
          : Promise.resolve()
      background_process_promise.then(() => {
        resolveConfigurationPromise({ configuration, loopbackDispatcher: shortcircuitLoopbackDispatcher, stopAndDrain })
      })
      async function stopAndDrain() {
        console.log(`draining [#${pendingAccessResultPromises.length}] pending replies ...`)
        await Promise.allSettled([
          ...Object.values(queueServices).map(({ stopAndDrain }) => stopAndDrain()),
          ...pendingAccessResultPromises,
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
