import { appDeployments, loggerProvider } from '@moodle/domain'
import * as domainCore from '@moodle/domain/core'
import * as domainGate from '@moodle/domain/gate'
import { coreGateDeps, deploymentInfoFromUrlString, executeModelOps, modelHandleProxy } from '@moodle/domain/lib'
import type * as model from '@moodle/domain/model'
import { getDomainFsDirectories, MOODLE_DEFAULT_HOME_DIR } from '@moodle/lib-domain-fs'
import { generateAlphanumId, generateUlid } from '@moodle/lib-id-gen'
import { getDefaultLocalFsStorageDirectory } from '@moodle/lib-storage-local-fs'
import { any_, email_address_schema, map, signed_token, url_string_schema } from '@moodle/lib-types'
import { cryptoDefaultEnv, get_default_crypto_secondarys_factory, provideCryptoDefaultEnv } from '@moodle/sec-crypto-default'
import {
  ArangoDbSecEnv,
  get_arango_persistence_factory,
  provideArangoDbSecEnv,
  provideArangoQueueServiceWorkers,
} from '@moodle/sec-db-arango'
import { migrateArangoDB } from '@moodle/sec-db-arango/migrate'
import { get_nodemailer_secondary_factory, NodemailerSecEnv, provideNodemailerSecEnv } from '@moodle/sec-email-nodemailer'
import {
  get_default_resource_ingestion_secondary_factory,
  provideDefaultResourceIngestorSecEnv,
} from '@moodle/sec-resource-ingestion-default'
import { fs_default_storage_factory, storageDefaultSecEnv } from '@moodle/sec-storage-local-fs'
import assert from 'assert'
import { activeSessionData } from 'domain/src/domain/model/accessControl.model/accessControl.model'
import dotenv from 'dotenv'
import { expand as dotenvExpand } from 'dotenv-expand'
import { readFileSync } from 'fs'
import * as path from 'path'
import { coerce, object } from 'zod'
import { createQueueServices } from './queue-services'
import { configurator } from './types'
import { createWinstonDomainLoggerProvider, winstonLoggerConfigs } from './winston-logger'
// import {
//   get_default_resource_ingestion_secondary_factory,
//   provideDefaultResourceIngestorSecEnv,
// } from '@moodle/sec-resource-ingestion-default'

type __ = model.jwtTokens.JwtTokensModel

type configuratorResult = {
  loggerProvider: loggerProvider
  modelDispatcher: moo.model.dispatcher
  stopAndDrain: () => Promise<void>
}

export const defaultConfigurator: configurator = ({ master }) => {
  const cache: map<Promise<configuratorResult>> = {}

  return {
    drain: configuratorDrain,
    access,
  }
  async function configuratorDrain() {
    const configResults = await Promise.all(Object.values(cache))
    return Promise.allSettled(configResults.map(({ stopAndDrain }) => stopAndDrain()))
  }

  async function access({ gateAccess }: { gateAccess: moo.gate.access<any_> }): Promise<coreGateDeps> {
    // const normalized_domain = domainName.split(':')[0]!.replace(/:/g, '_')
    const domainName = new URL(gateAccess.claims.server.href).hostname
    if (!cache[domainName]) {
      cache[domainName] = new Promise<configuratorResult>(resolveConfigurationPromise => {
        ;(async () => {
          const MOODLE_HOME_DIR = path.resolve(process.cwd(), process.env.MOODLE_HOME_DIR ?? MOODLE_DEFAULT_HOME_DIR)
          const domainFsDirectories = getDomainFsDirectories({
            homeDir: MOODLE_HOME_DIR,
            domainName,
          })
          dotenvExpand(dotenv.config({ path: path.join(domainFsDirectories.currentDomainDir, '.env'), override: true }))

          const loggerConfigs: winstonLoggerConfigs = { consoleLevel: 'debug' }

          console.debug({ currentDomainDir: domainFsDirectories.currentDomainDir, MOODLE_HOME_DIR })

          const { loggerProvider } = createWinstonDomainLoggerProvider({ loggerConfigs })

          const myLogger = loggerProvider({ for: 'infra', name: 'configurator', domainName })

          const isDev = process.env.NODE_ENV === 'development'

          const env = object({
            MOODLE_TEMP_FILE_MAX_RETENTION_SECONDS: coerce.number().default(60),
            MOODLE_SYS_ADMIN_EMAIL: email_address_schema(),
            MOODLE_NET_WEBAPP_DEPLOYMENT_URL: url_string_schema,
            MOODLE_FILE_SERVER_DEPLOYMENT_URL: url_string_schema,
          }).parse({
            MOODLE_TEMP_FILE_MAX_RETENTION_SECONDS: process.env.MOODLE_TEMP_FILE_MAX_RETENTION_SECONDS,
            MOODLE_SYS_ADMIN_EMAIL: process.env.MOODLE_SYS_ADMIN_EMAIL,
            MOODLE_NET_WEBAPP_DEPLOYMENT_URL: process.env.MOODLE_NET_WEBAPP_DEPLOYMENT_URL,
            MOODLE_FILE_SERVER_DEPLOYMENT_URL: process.env.MOODLE_FILE_SERVER_DEPLOYMENT_URL,
          })

          console.info(`configuring domain [${domainName}] env:`, { MOODLE_HOME_DIR, ...env })
          const MOODLE_CRYPTO_PRIVATE_KEY = readFileSync(
            path.join(domainFsDirectories.currentDomainDir, `private.key`),
            'utf8',
          )
          const MOODLE_CRYPTO_PUBLIC_KEY = readFileSync(
            path.join(domainFsDirectories.currentDomainDir, `public.key`),
            'utf8',
          )
          const domain_process_env = process.env as any_

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
          // const sys_admin_info: sys_admin_info = {
          //   email: env.MOODLE_SYS_ADMIN_EMAIL,
          // }
          const storageDir = getDefaultLocalFsStorageDirectory({ domainFsDirectories })
          const file_system_storage_sec_env: storageDefaultSecEnv = {
            localStorageFsDirectories: {
              storageDir: storageDir,
              currentDomainDir: domainFsDirectories.currentDomainDir,
              temp: domainFsDirectories.temp,
            },
          }

          const _appDeployments: appDeployments = {
            moodlenetWebapp: deploymentInfoFromUrlString(env.MOODLE_NET_WEBAPP_DEPLOYMENT_URL),
            filestoreHttp: deploymentInfoFromUrlString(env.MOODLE_FILE_SERVER_DEPLOYMENT_URL),
          }
          const default_resource_ingestor_env = provideDefaultResourceIngestorSecEnv({ env: domain_process_env })
          const arangodb = get_arango_persistence_factory(arango_db_env)
          const crypto = get_default_crypto_secondarys_factory(crypto_env)
          const nodemailer = get_nodemailer_secondary_factory(nodemailer_env)
          const localFsStorage = fs_default_storage_factory(file_system_storage_sec_env)
          const tikaResourceIngestor = get_default_resource_ingestion_secondary_factory(default_resource_ingestor_env)

          const models = {
            arangodb: arangodb.modelImpl,
            crypto,
            nodemailer,
            localFsStorage,
            tikaResourceIngestor,
            sessionManager: {
              accessControl: {
                activateUserSessionToken: {
                  '* call': async ({ userId }, _) => {
                    const { session } = await _.over(_.model.accessControl.getUserSession).call.query({
                      user: { type: 'auth', id: userId },
                    })

                    const activeSessionData: activeSessionData = {
                      session,
                      userId,
                    }

                    const sessionId = generateUlid({ onDate: new Date() })
                    const token = await generateToken({ sessionId }) // as signed_token
                    await arangodb.activeSessionCollection.save({ data: activeSessionData, _key: sessionId })
                    return { session, token }
                    async function generateToken({ sessionId }: { sessionId: string }) {
                      return JSON.stringify({ sessionId }) as signed_token
                    }
                  },
                },
                getMyUserSessionInfo: {
                  '* call': async ({ sessionToken }, _) => {
                    if (!sessionToken) {
                      return anonSession(_)
                    }
                    const validatedToken = await validateToken(sessionToken) // as signed_token
                    if (!validatedToken) {
                      return anonSession(_)
                    }
                    const { sessionId } = validatedToken
                    const m_foundDoc = await arangodb.activeSessionCollection.document(
                      { _key: sessionId },
                      { graceful: true },
                    )
                    if (!m_foundDoc) {
                      return anonSession(_)
                    }
                    return { info: { session: m_foundDoc.data.session, user: { id: m_foundDoc.data.userId, type: 'auth' } } }
                    async function validateToken(token: string): Promise<{ sessionId: string } | null> {
                      return JSON.parse(token)
                    }
                  },
                },
              },
            },
          } satisfies map<moo.model.impl>

          async function anonSession(_: moo.model.handle): Promise<{
            info: moo.session.info
          }> {
            const user: moo.session.info.user = { type: 'anon' }
            const { session } = await _.over(_.model.accessControl.getUserSession).call.query({ user })
            const info: moo.session.info = {
              session,
              user,
            }
            return { info }
          }

          if (master) {
            await migrateArangoDB({
              databaseConnections: arango_db_env.database_connections,
              log: loggerProvider({ for: 'infra', name: 'migrateArangoDB' }),
            }).catch(e => {
              myLogger.error('migrateArangoDB failed', e)
              throw e
            })
            const coreSetupModelHandle = modelHandleProxy({
              origin: { from: false, useCase: 'coreSetup' },
              modelAccessDispatcher,
            })
            await domainCore.setup({ modelHandle: coreSetupModelHandle })
          } else {
            const coreSetupModelHandle = modelHandleProxy({
              origin: { from: false, useCase: 'coreModelCheck' },
              modelAccessDispatcher,
            })
            await domainCore.modelCheck({ modelHandle: coreSetupModelHandle })
          }

          const pendingAccessResultPromises: Promise<unknown>[] = []
          const arangoQueueServiceWorkers = provideArangoQueueServiceWorkers({ dbStruct: arangodb.dbStruct })

          const queues = createQueueServices({
            modelDispatcher: modelAccessDispatcher,
            queueServiceWorkers: arangoQueueServiceWorkers,
            queues: [],
          })

          async function modelAccessDispatcher(access: moo.model.access<any_>): Promise<unknown> {
            const jobId = `${access.id}_${generateAlphanumId({ length: 4 })}`
            const enqueued = access.target.type === 'async'
            if (enqueued) {
              assert(jobId, 'domainAccess must have a callerContext for enqueuing a message')
              const queueService = queues.getNamedService({ access })
              if (queueService) {
                const enqueuePromise = queueService.enqueue({
                  jobId,
                  enqueueDate: new Date().toISOString(),
                  jobData: { access },
                })
                pendingAccessResultPromises.push(enqueuePromise)
                return enqueuePromise
              }
            }

            const accessResultPromise = executeModelOps({
              access,
              backModelAccessDispatcher: modelAccessDispatcher,
              loggerProvider,
              models,
              preAsync: enqueued,
            })
            pendingAccessResultPromises.push(accessResultPromise)
            accessResultPromise
              .catch(
                !(enqueued && jobId)
                  ? undefined
                  : () => {
                      const enqueuePromise = queues.defaultService.enqueue({
                        jobId,
                        enqueueDate: new Date().toISOString(),
                        jobData: { access },
                      })
                      pendingAccessResultPromises.push(enqueuePromise)
                    },
              )
              .finally(() => pendingAccessResultPromises.splice(pendingAccessResultPromises.indexOf(accessResultPromise), 1))
            return accessResultPromise
            // return shortCircuitLoopbackDispatcher({ configuration, domainAccess })
          }

          resolveConfigurationPromise({
            loggerProvider,
            modelDispatcher: modelAccessDispatcher,
            stopAndDrain,
          })

          return coreGateDeps

          async function stopAndDrain() {
            console.log(`draining [#${pendingAccessResultPromises.length}] pending replies ...`)
            await Promise.allSettled([queues.stopAndDrainAll(), ...pendingAccessResultPromises])
            console.log('drained pending replies')
          }
        })()
      }).catch(e => {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete cache[domainName]
        throw e
      })
    }
    const configuration = await cache[domainName]

    const getMyUserSessionModelHandle = modelHandleProxy({
      origin: { from: false, useCase: 'getMyUserSession' },
      modelAccessDispatcher: configuration.modelDispatcher,
    })

    const coreId = generateUlid({ onDate: new Date() })
    const coreGateDeps: coreGateDeps = {
      core: domainCore.core,
      coreAccess: {
        gateAccess,
        id: coreId,
        now: new Date().toISOString(),
        sessionInfo: (
          await getMyUserSessionModelHandle
            .over(getMyUserSessionModelHandle.model.accessControl.getMyUserSessionInfo)
            .call.query({ sessionToken: gateAccess.claims.server.userToken })
        ).info,
      },
      gateProvider: domainGate.gateProvider,
      loggerProvider: configuration.loggerProvider,
      modelHandle: modelHandleProxy({
        origin: { from: false, useCase: { id: coreId, path: gateAccess.path } },
        modelAccessDispatcher: configuration.modelDispatcher,
      }),
    }

    return coreGateDeps
  }
}
