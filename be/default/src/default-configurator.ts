import { appDeployments, loggerProvider } from '@moodle/domain'
import * as domainCore from '@moodle/domain/core'
import * as domainGate from '@moodle/domain/gate'
import { coreGateDeps, deploymentInfoFromUrlString, executeModel, preModelOps, modelHandleProxy, postModelOps, Error4xx } from '@moodle/domain/lib'
import type * as model from '@moodle/domain/model'
import { getDomainFsDirectories, MOODLE_DEFAULT_HOME_DIR } from '@moodle/lib-domain-fs'
import { generateAlphanumId, generateUlid } from '@moodle/lib-id-gen'
import { getDefaultLocalFsStorageDirectory } from '@moodle/lib-storage-local-fs'
import { any_, email_address_schema, map, url_string_schema } from '@moodle/lib-types'
import { cryptoDefaultEnv, get_default_crypto_secondarys_factory, provideCryptoDefaultEnv } from '@moodle/sec-crypto-default'
import { ArangoDbSecEnv, get_arango_persistence_factory, provideArangoDbSecEnv, provideArangoQueueServiceWorkers } from '@moodle/sec-db-arango'
import { upgradeArangoDB } from '@moodle/sec-db-arango/dbUpgrade'
import { get_nodemailer_secondary_factory, NodemailerSecEnv, provideNodemailerSecEnv } from '@moodle/sec-email-nodemailer'
import { get_default_resource_ingestion_secondary_factory, provideDefaultResourceIngestorSecEnv } from '@moodle/sec-resource-ingestion-default'
import { fs_default_storage_factory, storageDefaultSecEnv } from '@moodle/sec-storage-local-fs'
import dotenv from 'dotenv'
import { expand as dotenvExpand } from 'dotenv-expand'
import { readFileSync } from 'fs'
import * as path from 'path'
import { coerce, object } from 'zod'
import { createQueueServices } from './queue-services'
import { configurator } from './types'
import { createWinstonDomainLoggerProvider, winstonLoggerConfigs } from './winston-logger'
import { isLeft, left } from 'fp-ts/Either'
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
    console.log(`draining [#${Object.keys(cache).length}] pending configurations ...`)
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

          // console.debug({ currentDomainDir: domainFsDirectories.currentDomainDir, MOODLE_HOME_DIR })

          const loggerConfigs: winstonLoggerConfigs = { consoleLevel: 'debug', file: { level: 'debug', path: path.join(domainFsDirectories.currentDomainDir, 'logs') } }
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
          const MOODLE_CRYPTO_PRIVATE_KEY = readFileSync(path.join(domainFsDirectories.currentDomainDir, `private.key`), 'utf8')
          const MOODLE_CRYPTO_PUBLIC_KEY = readFileSync(path.join(domainFsDirectories.currentDomainDir, `public.key`), 'utf8')
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
          } satisfies map<moo.model.impl>

          const pendingAccessResultPromises: Promise<unknown>[] = []

          const arangoQueueServiceWorkers = provideArangoQueueServiceWorkers({ dbStruct: arangodb.dbStruct })

          const _from_queue_sym_ = Symbol('fromQueue')
          const queues = createQueueServices({
            modelDispatcher: access => {
              ;(access as any_)[_from_queue_sym_] = _from_queue_sym_
              return modelAccessDispatcher(access)
            },
            queueServiceWorkers: arangoQueueServiceWorkers,
            queues: {},
          })

          if (master) {
            await upgradeArangoDB({
              databaseConnections: arango_db_env.database_connections,
              log: loggerProvider({ for: 'setup', name: 'upgradeArangoDB', domainName }),
            }).catch(e => {
              myLogger.error('upgradeArangoDB failed', e)
              throw e
            })

            await domainCore
              .setup({
                handle: modelHandleProxy({
                  origin: { from: false, useCase: 'domainCore.setup' },
                  modelAccessDispatcher,
                }),
                log: loggerProvider({ for: 'setup', name: 'domainCore.setup', domainName }),
              })
              .catch(e => {
                myLogger.error('domainCore.setup failed', e)
                throw e
              })

            await queues.startAll()
          }

          await domainCore
            .preflight({
              handle: modelHandleProxy({
                origin: { from: false, useCase: 'domainCore.preflight' },
                modelAccessDispatcher,
              }),
              log: loggerProvider({ for: 'setup', name: 'domainCore.preflight', domainName }),
            })
            .then(result => {
              if (isLeft(result)) {
                throw new TypeError(result.left)
              }
            })
            .catch(e => {
              myLogger.error('domainCore.preflight failed', e)
              throw e
            })

          async function modelAccessDispatcher(access: moo.model.access<any_>): Promise<unknown> {
            type __ = keyof moo.Models extends infer modelName
              ? modelName extends keyof moo.Models
                ? keyof moo.Models[modelName] extends infer frstProp
                  ? [modelName, frstProp]
                  : never
                : never
              : never
            const [model, frstProp] = access.target.path as __
            const isFromQueue = _from_queue_sym_ in access
            const enqueueing = !isFromQueue && access.target.type === 'async' && ((model === 'mailer' && frstProp === 'send') || (model === 'mailer' && frstProp === 'send'))
            const jobId = `${access.id}_${generateAlphanumId({ length: 4 })}`
            if (enqueueing) {
              const queueService = queues.services.default
              pushPendingPromise(
                queueService
                  .enqueue({
                    jobId,
                    enqueueDate: new Date().toISOString(),
                    jobData: { access },
                  })
                  .then(() =>
                    pushPendingPromise(
                      preModelOps({
                        access,
                        backModelAccessDispatcher: modelAccessDispatcher,
                        loggerProvider,
                        models,
                      }),
                    ),
                  ),
              )
              return
            }

            const accessResultPromise = pushPendingPromise(
              (isFromQueue
                ? Promise.resolve()
                : preModelOps({
                    access,
                    backModelAccessDispatcher: modelAccessDispatcher,
                    loggerProvider,
                    models,
                  })
              )
                .then(async () => {
                  const outcome = await executeModel({
                    access,
                    backModelAccessDispatcher: modelAccessDispatcher,
                    loggerProvider,
                    models,
                  })
                  if (isLeft(outcome) && outcome.left.desc !== 'Not Implemented' && !isFromQueue && access.target.type === 'async') {
                    myLogger.error('executeModel (async, formerly not enqueued) failed, will enqueue', { jobId, error: outcome.left, access })
                    await queues.defaultService.enqueue({
                      jobId,
                      enqueueDate: new Date().toISOString(),
                      jobData: { access },
                    })
                  }
                  return outcome
                })
                .then(outcome => {
                  postModelOps({
                    access,
                    backModelAccessDispatcher: modelAccessDispatcher,
                    loggerProvider,
                    models,
                    outcome,
                  })
                  return outcome
                })
                .catch(error => {
                  myLogger.warn('model access failed', error, 'access:', access)
                  return left(new Error4xx('Internal Server Error', { message: error.message, error }))
                }),
            )
            return accessResultPromise.then(outcome => {
              if (isLeft(outcome)) {
                throw outcome.left
              }
              return outcome.right
            })
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
          function pushPendingPromise<t>(p: Promise<t>) {
            pendingAccessResultPromises.push(p)
            p.finally(() => pendingAccessResultPromises.splice(pendingAccessResultPromises.indexOf(p), 1))
            return p
          }
        })()
      }).catch(e => {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete cache[domainName]
        throw e
      })
    }

    const configuration = await cache[domainName]

    const myModelHandle = modelHandleProxy({
      origin: { from: false, useCase: 'configurator' },
      modelAccessDispatcher: configuration.modelDispatcher,
    })

    const coreId = generateUlid({ onDate: new Date() })
    const coreGateDeps: coreGateDeps = {
      core: domainCore.domainCoreImpl,
      coreAccess: {
        gateAccess,
        id: coreId,
        now: new Date().toISOString(),
        sessionInfo: (await myModelHandle.over(myModelHandle.model.accessControl.getMyUserSessionInfo).call.query({ authSessionToken: gateAccess.claims.server.authSessionToken }))
          .info,
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

