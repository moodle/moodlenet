import { appDeployments, loggerProvider } from '@moodle/domain'
import * as domainCore from '@moodle/domain/core'
import { gateProvider } from '@moodle/domain/gate'
import { deploymentInfoFromUrlString, Error4xx, executeModel, gateCoreDeps, isError4xx, modelHandleProxy, postModelOps, preModelOps } from '@moodle/domain/lib'
import type * as model from '@moodle/domain/model'
import { generateAlphanumId, generateUlid } from '@moodle/lib-id-gen'
import { getDefaultLocalFsStorageDirectory, localStorageFsDirectories } from '@moodle/lib-storage-local-fs'
import { sanitizeFilename } from '@moodle/lib-temp-dir'
import { any_, email_address_schema, map, url_string_schema } from '@moodle/lib-types'
import { cryptoDefaultEnv, get_default_crypto_secondarys_factory, provideCryptoDefaultEnv } from '@moodle/sec-crypto-default'
import { ArangoDbSecEnv, get_arango_persistence_factory, provideArangoDbSecEnv, provideArangoQueueServiceWorkers } from '@moodle/sec-db-arango'
import { upgradeArangoDB } from '@moodle/sec-db-arango/dbUpgrade'
import { get_nodemailer_secondary_factory, NodemailerSecEnv, provideNodemailerSecEnv } from '@moodle/sec-email-nodemailer'
import { get_default_resource_ingestion_secondary_factory, provideDefaultResourceIngestorSecEnv } from '@moodle/sec-resource-ingestion-default'
import { fs_default_storage_factory, storageDefaultSecEnv } from '@moodle/sec-storage-local-fs'
import assert from 'assert'
import dotenv from 'dotenv'
import { expand as dotenvExpand } from 'dotenv-expand'
import { Either, isLeft, left, right } from 'fp-ts/Either'
import { mkdirSync, readFileSync } from 'fs'
import * as path from 'path'
import { coerce, object } from 'zod'
import { createQueueServices } from './queue-services'
import { configurator } from './types'
import { createWinstonDomainLoggerProvider, winstonLoggerConfigs } from './winston-logger'
// import {
//   get_default_resource_ingestion_secondary_factory,
//   provideDefaultResourceIngestorSecEnv,
// } from '@moodle/sec-resource-ingestion-default'

type __ = model.signedTokens.signedTokensModel

type configuratorResult = {
  loggerProvider: loggerProvider
  modelEnvelopeDispatcher: moo.def.model.dispatcher
  stopAndDrain: () => Promise<void>
}

assert(process.env.MOODLE_HOME_DIR, `MOODLE_HOME_DIR is not defined`)
const MOODLE_HOME_DIR = path.resolve(process.cwd(), process.env.MOODLE_HOME_DIR)
const MOODLE_TEMP_DIR = path.resolve(MOODLE_HOME_DIR, '.temp')
mkdirSync(MOODLE_TEMP_DIR, { recursive: true })

export const defaultConfigurator: configurator = ({ master }) => {
  const cache: map<Promise<configuratorResult>> = {}

  return {
    drain: configuratorDrain,
    gate,
  }
  async function configuratorDrain() {
    console.log(`draining [#${Object.keys(cache).length}] pending configurations ...`)
    const configResults = await Promise.all(Object.values(cache))
    return Promise.allSettled(configResults.map(({ stopAndDrain }) => stopAndDrain()))
  }

  async function gate({ gateRequest }: { gateRequest: moo.def.gate.provider.request }): Promise<gateCoreDeps> {
    // const normalized_domain = domainName.split(':')[0]!.replace(/:/g, '_')
    const domainName = new URL(gateRequest.info.claims.server.href).hostname
    if (!cache[domainName]) {
      cache[domainName] = new Promise<configuratorResult>(resolveConfigurationPromise => {
        ;(async () => {
          const currentDomainDir = path.resolve(MOODLE_HOME_DIR, sanitizeFilename(domainName))
          const localStorageFsDirectories: localStorageFsDirectories = {
            tempDir: MOODLE_TEMP_DIR,
            storageDir: getDefaultLocalFsStorageDirectory({ currentDomainDir }),
            currentDomainDir,
            domainName,
          }
          dotenvExpand(dotenv.config({ path: path.join(localStorageFsDirectories.currentDomainDir, '.env'), override: true }))
      console.debug(`confiuguring domainName ${domainName}`)

      console.debug({ currentDomainDir: localStorageFsDirectories.currentDomainDir, MOODLE_HOME_DIR })

          const loggerConfigs: winstonLoggerConfigs = { consoleLevel: 'debug', file: { level: 'debug', path: path.join(localStorageFsDirectories.currentDomainDir, 'logs') } }
          const { loggerProvider } = createWinstonDomainLoggerProvider({ loggerConfigs })

          const myLogger = loggerProvider({ for: 'infra', name: 'configurator', more: { domainName } })

          const isDev = process.env.NODE_ENV === 'development'

          const env = object({
            MOODLE_TEMP_FILE_MAX_RETENTION_SECONDS: coerce.number().default(60),
            MOODLE_SYS_ADMIN_EMAIL: email_address_schema(),
            MOODLE_NET_WEBAPP_DEPLOYMENT_URL: url_string_schema,
            // MOODLE_FILE_SERVER_DEPLOYMENT_URL: url_string_schema,
          }).parse({
            MOODLE_TEMP_FILE_MAX_RETENTION_SECONDS: process.env.MOODLE_TEMP_FILE_MAX_RETENTION_SECONDS,
            MOODLE_SYS_ADMIN_EMAIL: process.env.MOODLE_SYS_ADMIN_EMAIL,
            MOODLE_NET_WEBAPP_DEPLOYMENT_URL: process.env.MOODLE_NET_WEBAPP_DEPLOYMENT_URL,
            // MOODLE_FILE_SERVER_DEPLOYMENT_URL: process.env.MOODLE_FILE_SERVER_DEPLOYMENT_URL,
          })

          console.info(`configuring domain [${domainName}] env:`, { MOODLE_HOME_DIR, ...env })
          const MOODLE_CRYPTO_PRIVATE_KEY = readFileSync(path.join(localStorageFsDirectories.currentDomainDir, `private.key`), 'utf8')
          const MOODLE_CRYPTO_PUBLIC_KEY = readFileSync(path.join(localStorageFsDirectories.currentDomainDir, `public.key`), 'utf8')
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
          const file_system_storage_sec_env: storageDefaultSecEnv = { localStorageFsDirectories }

          const _appDeployments: appDeployments = {
            moodlenetWebapp: deploymentInfoFromUrlString(env.MOODLE_NET_WEBAPP_DEPLOYMENT_URL),
            // filestoreHttp: deploymentInfoFromUrlString(env.MOODLE_FILE_SERVER_DEPLOYMENT_URL),
          }
          const default_resource_ingestor_env = provideDefaultResourceIngestorSecEnv({ env: domain_process_env })
          const arangodb = get_arango_persistence_factory(arango_db_env)
          const crypto = get_default_crypto_secondarys_factory(crypto_env)
          const nodemailer = get_nodemailer_secondary_factory(nodemailer_env)
          const localFsStorage = fs_default_storage_factory(file_system_storage_sec_env)
          const tikaResourceIngestor = get_default_resource_ingestion_secondary_factory(default_resource_ingestor_env)

          const models = {
            ...domainCore.model.cores,
            arangodb: arangodb.modelImpl,
            crypto,
            nodemailer,
            localFsStorage,
            tikaResourceIngestor,
          } satisfies map<moo.def.model.impl>

          const pendingModelResultPromises: Promise<unknown>[] = []

          const arangoQueueServiceWorkers = provideArangoQueueServiceWorkers({ dbStruct: arangodb.dbStruct })

          const _from_queue_sym_ = Symbol('fromQueue')
          const queues = createQueueServices({
            modelDispatcher: envelope => {
              ;(envelope as any_)[_from_queue_sym_] = _from_queue_sym_
              return modelEnvelopeDispatcher(envelope)
            },
            queueServiceWorkers: arangoQueueServiceWorkers,
            queues: {},
          })

          if (master) {
            await upgradeArangoDB({
              databaseConnections: arango_db_env.database_connections,
              log: loggerProvider({ for: 'setup', name: 'upgradeArangoDB', more: { domainName } }),
            }).catch(e => {
              myLogger.error('upgradeArangoDB failed', e)
              throw e
            })

            await domainCore.versionControl
              .setup({
                model: modelHandleProxy({
                  origin: { model: false, request: { kind: 'internal', name: 'domainCore.setup', more: { domainName } } },
                  modelDispatcher: modelEnvelopeDispatcher,
                }),
                log: loggerProvider({ for: 'setup', name: 'domainCore.setup', more: { domainName } }),
              })
              .catch(e => {
                myLogger.error('domainCore.setup failed', e)
                throw e
              })

            await queues.startAll()
          }

          await domainCore.versionControl
            .preflight({
              model: modelHandleProxy({
                origin: { model: false, request: { kind: 'internal', name: 'domainCore.preflight', more: { domainName } } },
                modelDispatcher: modelEnvelopeDispatcher,
              }),
              log: loggerProvider({ for: 'setup', name: 'domainCore.preflight', more: { domainName } }),
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

          async function modelEnvelopeDispatcher(envelope: moo.def.model.envelope<any_>): Promise<Either<Error4xx, unknown>> {
            type __ = keyof moo.Models extends infer modelName
              ? modelName extends keyof moo.Models
                ? keyof moo.Models[modelName] extends infer frstProp
                  ? [modelName, frstProp]
                  : never
                : never
              : never
            const [model, frstProp] = envelope.path as __
            const isFromQueue = _from_queue_sym_ in envelope
            const enqueueing = !isFromQueue && envelope.opType === 'async' && ((model === 'mailer' && frstProp === 'send') || (model === 'mailer' && frstProp === 'send'))
            const jobId = `${envelope.id}_${generateAlphanumId({ length: 4 })}`
            if (enqueueing) {
              const queueService = queues.services.default
              pushPendingPromise(
                queueService
                  .enqueue({
                    jobId,
                    enqueueDate: new Date().toISOString(),
                    jobData: { envelope },
                  })
                  .then(() =>
                    pushPendingPromise(
                      preModelOps({
                        envelope,
                        modelEnvelopeDispatcher,
                        loggerProvider,
                        models,
                      }),
                    ),
                  ),
              )
              return right(void 0)
            }

            const modelResultPromise = pushPendingPromise(
              (isFromQueue
                ? Promise.resolve()
                : preModelOps({
                    envelope,
                    modelEnvelopeDispatcher,
                    loggerProvider,
                    models,
                  })
              )
                .then(async () => {
                  const exeResult = await executeModel({
                    envelope,
                    modelEnvelopeDispatcher,
                    loggerProvider,
                    models,
                  })
                  if (isError4xx(exeResult) && exeResult.desc !== 'Not Implemented' && !isFromQueue && envelope.opType === 'async') {
                    myLogger.info('executeModel: async call - formerly not enqueued - failed, will enqueue', { jobId, error: exeResult, envelope })
                    await queues.defaultService.enqueue({
                      jobId,
                      enqueueDate: new Date().toISOString(),
                      jobData: { envelope: envelope },
                    })
                    return right(void 0)
                  }
                  const outcome = isError4xx(exeResult) ? left(exeResult) : right(exeResult)

                  postModelOps({
                    envelope,
                    modelEnvelopeDispatcher,
                    loggerProvider,
                    models,
                    outcome,
                  })
                  // console.log(outcome, '*******************************')
                  return outcome
                })
                .catch(error => {
                  myLogger.warn('model access failed', error, 'envelope:', envelope)
                  return left(new Error4xx('Internal Server Error', { message: error.message, error }))
                }),
            )
            return modelResultPromise
          }

          resolveConfigurationPromise({
            loggerProvider,
            modelEnvelopeDispatcher,
            stopAndDrain,
          })

          async function stopAndDrain() {
            console.log(`draining [${domainName}]'s [#${pendingModelResultPromises.length}] pending replies ...`)
            await Promise.allSettled([queues.stopAndDrainAll(), ...pendingModelResultPromises])
            console.log(`drained [${domainName}]'s pending replies`)
          }
          function pushPendingPromise<t>(p: Promise<t>) {
            pendingModelResultPromises.push(p)
            p.finally(() => pendingModelResultPromises.splice(pendingModelResultPromises.indexOf(p), 1))
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
      origin: { model: false, request: { kind: 'internal', name: 'configurator', more: { domainName } } },
      modelDispatcher: configuration.modelEnvelopeDispatcher,
    })

    const coreId = generateUlid({ onDate: new Date() })
    // console.time(`getTokenPermissionsInfo`)
    const { info: userPoliciesInfo } = await myModelHandle.accessControl.getTokenPoliciesInfo.query({ authSessionToken: gateRequest.info.claims.server.authSessionToken })
    // console.timeEnd(`getTokenPermissionsInfo`)
    // console.log(inspect(permissionsInfo, { depth: 100 }))
    const coreGateDeps: gateCoreDeps = {
      core: domainCore.branch,
      request: {
        gateRequest,
        id: coreId,
        now: new Date().toISOString(),
        userPoliciesInfo,
      },
      gateProvider,
      loggerProvider: configuration.loggerProvider,
      model: modelHandleProxy({
        origin: { model: false, request: { kind: 'core', id: coreId, gateRequest: { info: gateRequest.info, path: gateRequest.path } } },
        modelDispatcher: configuration.modelEnvelopeDispatcher,
      }),
    }
    return coreGateDeps
  }
}
