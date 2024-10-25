import { moduleCore, secondaryAdapter, secondaryProvider, sys_admin_info } from '@moodle/domain'
import { configuration, deploymentInfoFromUrlString } from '@moodle/domain/lib'
import { getFsDirectories, MOODLE_DEFAULT_HOME_DIR } from '@moodle/lib-local-fs-storage'
import { _any, email_address_schema, map, url_string_schema } from '@moodle/lib-types'
import { userAccount_core } from '@moodle/module/user-account/core'
import { moodlenet_nextjs_core } from '@moodle/module/moodlenet-react-app/core'
import { moodlenet_core } from '@moodle/module/moodlenet/core'
import { org_core } from '@moodle/module/org/core'
import { storage_core } from '@moodle/module/storage/core'
import { user_profile_core } from '@moodle/module/user-profile/core'
import { CryptoDefaultEnv, get_default_crypto_secondarys_factory, provideCryptoDefaultEnv } from '@moodle/sec-crypto-default'
import { ArangoDbSecEnv, get_arango_persistence_factory, provideArangoDbSecEnv } from '@moodle/sec-db-arango'
import { migrateArangoDB } from '@moodle/sec-db-arango/migrate'
import { get_nodemailer_secondary_factory, NodemailerSecEnv, provideNodemailerSecEnv } from '@moodle/sec-email-nodemailer'
import { get_storage_default_secondary_factory, StorageDefaultSecEnv } from '@moodle/sec-storage-default'
import dotenv from 'dotenv'
import { expand as dotenvExpand } from 'dotenv-expand'
import { readFileSync } from 'fs'
import * as path from 'path'
import { coerce, literal, object } from 'zod'
import { configurator } from './types'
import { createDefaultDomainLoggerProvider } from './winston-logger'

const cache: map<Promise<configuration>> = {}

export const default_configurator: configurator = async ({ domainAccess, loggerConfigs }) => {
  if (!domainAccess.primarySession?.domain) {
    throw new Error('domainAccess.primarySession.domain is required')
  }
  const domainName = domainAccess.primarySession.domain
  // const normalized_domain = domainName.split(':')[0]!.replace(/:/g, '_')
  if (!cache[domainName]) {
    cache[domainName] = new Promise<configuration>(promiseResolveConfiguration => {
      const MOODLE_HOME_DIR = path.resolve(process.cwd(), process.env.MOODLE_HOME_DIR ?? MOODLE_DEFAULT_HOME_DIR)
      const { currentDomainDir } = getFsDirectories({
        homeDir: MOODLE_HOME_DIR,
        domainName,
      })
      dotenvExpand(dotenv.config({ path: path.join(currentDomainDir, '.env'), override: true }))
      console.debug({ currentDomainDir, MOODLE_HOME_DIR })

      const { loggerProvider } = createDefaultDomainLoggerProvider({ loggerConfigs })

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

      console.info(`configuring domain [${domainName}] env:`, { MOODLE_HOME_DIR, ...env })
      const MOODLE_CRYPTO_PRIVATE_KEY = readFileSync(path.join(currentDomainDir, `private.key`), 'utf8')
      const MOODLE_CRYPTO_PUBLIC_KEY = readFileSync(path.join(currentDomainDir, `public.key`), 'utf8')
      const _process_env = process.env as _any

      const arango_db_env: ArangoDbSecEnv = provideArangoDbSecEnv({
        env: {
          ..._process_env,
          MOODLE_ARANGODB_ISDEV: `${isDev}`,
          MOODLE_ARANGODB_DOMAIN_NAME: domainName,
        },
      })
      const crypto_env: CryptoDefaultEnv = provideCryptoDefaultEnv({
        env: { ..._process_env, MOODLE_CRYPTO_PRIVATE_KEY, MOODLE_CRYPTO_PUBLIC_KEY },
      })
      const nodemailer_env: NodemailerSecEnv = provideNodemailerSecEnv({
        env: _process_env,
      })
      const sys_admin_info: sys_admin_info = {
        email: env.MOODLE_SYS_ADMIN_EMAIL,
      }

      const file_system_storage_sec_env: StorageDefaultSecEnv = {
        homeDir: MOODLE_HOME_DIR,
      }

      const secondaryProviders: secondaryProvider[] = [
        // sec modules
        get_arango_persistence_factory(arango_db_env),
        get_default_crypto_secondarys_factory(crypto_env),
        get_nodemailer_secondary_factory(nodemailer_env),
        get_storage_default_secondary_factory(file_system_storage_sec_env),
        secondaryContext => {
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
      ]

      const moduleCores: moduleCore<_any>[] = [
        // core modules
        moodlenet_core,
        org_core,
        userAccount_core,
        moodlenet_nextjs_core,
        user_profile_core,
        storage_core,
        {
          modName: 'env',
          primary(ctx) {
            return {
              domain: {
                async info() {
                  return { name: domainName }
                },
              },
              application: {
                async deployments() {
                  return {
                    moodlenetWebapp: deploymentInfoFromUrlString(env.MOODLE_NET_WEBAPP_DEPLOYMENT_URL),
                    filestoreHttp: deploymentInfoFromUrlString(env.MOODLE_FILE_SERVER_DEPLOYMENT_URL),
                  }
                },
              },
            }
          },
        },
      ]

      let do_start_background_processes = env.MOODLE_CORE_INIT_BACKGROUND_PROCESSES === 'true'
      migrateArangoDB({
        databaseConnections: arango_db_env.database_connections,
        log: loggerProvider({ domain: domainName, contextLayer: 'secondary', id: 'migration', endpoint: ['sec-arangodb'] }),
      }).then(() => {
        const configuration: configuration = {
          moduleCores,
          secondaryProviders,
          loggerProvider,
          domain: domainName,
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
