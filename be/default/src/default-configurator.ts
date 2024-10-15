import * as mod_iam from '@moodle/core-iam'
import * as mod_net from '@moodle/core-net'
import * as mod_net_webapp_nextjs from '@moodle/core-net-webapp-nextjs'
import * as mod_org from '@moodle/core-org'
import * as mod_storage from '@moodle/core-storage'
import * as mod_user_home from '@moodle/core-user-home'
import {
  coreProvider,
  coreProviderObject,
  domainCore,
  env as domainEnv,
  secondaryAdapter,
  secondaryProvider,
  storage,
  sys_admin_info,
} from '@moodle/domain'
import { _any, email_address_schema, map, url_string_schema } from '@moodle/lib-types'
import * as cryptoSec from '@moodle/sec-crypto-default'
import * as arangoSec from '@moodle/sec-db-arango'
import { migrateArangoDB } from '@moodle/sec-db-arango/migrate'
import * as nodemailerSec from '@moodle/sec-email-nodemailer'
import * as storageSec from '@moodle/sec-storage-default'
import dotenv from 'dotenv'
import { expand as dotenvExpand } from 'dotenv-expand'
import { readFileSync } from 'fs'
import * as path from 'path'
import { inspect } from 'util'
import { coerce, literal, object } from 'zod'
import { createDefaultDomainLoggerProvider } from './default-logger'
import { configuration, configurator } from './types'

const cache: map<Promise<configuration>> = {}

export const default_configurator: configurator = async ({ domainAccess, loggerConfigs }) => {
  if (!domainAccess.primarySession?.domain) {
    throw new Error('domainAccess.primarySession.domain is required')
  }
  const domainName = domainAccess.primarySession.domain
  // const normalized_domain = domainName.split(':')[0]!.replace(/:/g, '_')
  if (!cache[domainName]) {
    cache[domainName] = new Promise<configuration>(promiseResolveConfiguration => {
      const MOODLE_HOME_DIR = path.resolve(
        process.cwd(),
        process.env.MOODLE_HOME_DIR ?? storage.MOODLE_DEFAULT_HOME_DIR,
      )
      const { currentDomainDir } = storage.getFsDirectories({
        homeDir: MOODLE_HOME_DIR,
        domainName,
      })
      console.log({ currentDomainDir, MOODLE_HOME_DIR, domainAccess })
      dotenvExpand(dotenv.config({ path: path.join(currentDomainDir, '.env'), override: true }))

      const isDev = process.env.NODE_ENV === 'development'

      const env = object({
        MOODLE_TEMP_FILE_MAX_RETENTION_SECONDS: coerce.number().default(60),
        MOODLE_CORE_INIT_BACKGROUND_PROCESSES: literal('true').or(literal('false')).optional(),
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

      console.info(
        `domain [${domainName}] env:`,
        inspect({ MOODLE_HOME_DIR, ...env }, { colors: true, sorted: true }),
      )
      const MOODLE_CRYPTO_PRIVATE_KEY = readFileSync(
        path.join(currentDomainDir, `private.key`),
        'utf8',
      )
      const MOODLE_CRYPTO_PUBLIC_KEY = readFileSync(
        path.join(currentDomainDir, `public.key`),
        'utf8',
      )
      const _process_env = process.env as _any

      const arango_db_env: arangoSec.ArangoDbSecEnv = arangoSec.provideEnv({
        env: {
          ..._process_env,
          MOODLE_ARANGODB_ISDEV: `${isDev}`,
          MOODLE_ARANGODB_DOMAIN_NAME: domainName,
        },
      })
      const crypto_env: cryptoSec.CryptoDefaultEnv = cryptoSec.provideEnv({
        env: { ..._process_env, MOODLE_CRYPTO_PRIVATE_KEY, MOODLE_CRYPTO_PUBLIC_KEY },
      })
      const nodemailer_env: nodemailerSec.NodemailerSecEnv = nodemailerSec.provideEnv({
        env: _process_env,
      })
      const sys_admin_info: sys_admin_info = {
        email: env.MOODLE_SYS_ADMIN_EMAIL,
      }

      const file_system_storage_sec_env: storageSec.StorageDefaultSecEnv = {
        homeDir: MOODLE_HOME_DIR,
      }
      const domainLoggerProvider = createDefaultDomainLoggerProvider({ domainName, loggerConfigs })
      function modLogger(modName: string) {
        return domainLoggerProvider.getChildLogger({ modName })
      }

      const secondaryProviders: secondaryProvider[] = [
        // sec modules
        arangoSec.get_arango_persistence_factory(arango_db_env)({
          domain: domainName,
          log: modLogger('arango-secondary'),
        }),
        cryptoSec.get_default_crypto_secondarys_factory(crypto_env)({
          domain: domainName,
          log: modLogger('crypto-secondary'),
        }),
        nodemailerSec.get_nodemailer_secondary_factory(nodemailer_env)({
          domain: domainName,
          log: modLogger('nodemailer-secondary'),
        }),
        storageSec.get_storage_default_secondary_factory(file_system_storage_sec_env)({
          domain: domainName,
          log: modLogger('storage-secondary'),
        }),
        (bootstrapContext => {
          return secondaryContext => {
            const secondaryAdapter: secondaryAdapter = {
              env: {
                query: {
                  async getSysAdminInfo() {
                    return sys_admin_info
                  },
                },
              },
            }
            return secondaryAdapter
          }
        })({ domain: domainName, log: modLogger('env-secondary') }),
      ]

      const coreProviderObjects: coreProviderObject<_any>[] = [
        // core modules
        mod_net.net_core({ domain: domainName, log: modLogger('net-core') }),
        mod_org.org_core({ domain: domainName, log: modLogger('org-core') }),
        mod_iam.iam_core({ domain: domainName, log: modLogger('iam-core') }),
        mod_net_webapp_nextjs.net_webapp_nextjs_core({
          domain: domainName,
          log: modLogger('net_webapp_nextjs-core'),
        }),
        mod_user_home.user_home_core({ domain: domainName, log: modLogger('user_home-core') }),
        mod_storage.storage_core({ domain: domainName, log: modLogger('storage-core') }),
        ((bootstrapContext): coreProviderObject<'env'> => {
          return {
            modName: 'env',
            provider(coreContext) {
              const envCore: domainCore<'env'> = {
                primary(primaryCtx) {
                  return {
                    domain: {
                      async info() {
                        return { name: domainName }
                      },
                    },
                    application: {
                      async deployments() {
                        return {
                          moodlenetWebapp: domainEnv.deploymentInfoFromUrlString(
                            env.MOODLE_NET_WEBAPP_DEPLOYMENT_URL,
                          ),
                          filestoreHttp: domainEnv.deploymentInfoFromUrlString(
                            env.MOODLE_FILE_SERVER_DEPLOYMENT_URL,
                          ),
                        }
                      },
                    },
                  }
                },
              }
              return envCore
            },
          }
        })({ domain: domainName, log: modLogger('env-core') }),
      ]

      let do_start_background_processes = env.MOODLE_CORE_INIT_BACKGROUND_PROCESSES === 'true'
      migrateArangoDB(arango_db_env).then(() => {
        const configuration: configuration = {
          coreProviderObjects,
          secondaryProviders,
          mainLogger: modLogger('main'),
          get start_background_processes() {
            const resp = do_start_background_processes
            do_start_background_processes = false
            return resp
          },
        }
        promiseResolveConfiguration(configuration)
      })
    }).catch(e => {
      delete cache[domainName]
      throw e
    })
  }

  return cache[domainName]
}

export default default_configurator
