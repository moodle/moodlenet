import { moodle_core_factory, moodle_secondary_factory, env } from '@moodle/domain'
import { deploymentInfoFromUrlString } from '@moodle/lib-ddd'
import { _any, email_address_schema, map, url_string_schema } from '@moodle/lib-types'
import * as mod_iam from '@moodle/mod-iam'
import * as mod_net from '@moodle/mod-net'
import * as mod_net_webapp_nextjs from '@moodle/mod-net-webapp-nextjs'
import * as mod_org from '@moodle/mod-org'
import * as mod_user_home from '@moodle/mod-user-home'
import * as mod_storage from '@moodle/mod-storage'
import * as cryptoSec from '@moodle/sec-crypto-default'
import * as arangoSec from '@moodle/sec-db-arango'
import { migrateArangoDB } from '@moodle/sec-db-arango/migrate'
import * as nodemailerSec from '@moodle/sec-email-nodemailer'
import * as storageSec from '@moodle/sec-storage-default'
import dotenv from 'dotenv'
import { expand as dotenvExpand } from 'dotenv-expand'
import { readFileSync } from 'fs'
import * as path from 'path'
import sanitizeFileName from 'sanitize-filename'
import { inspect } from 'util'
import { coerce, literal, object } from 'zod'
import { configuration, configurator } from './types'
// import * as argon2 from 'argon2'
import { DEFAULT_DOMAINS_HOME_DIR_NAME } from '@moodle/mod-storage/lib'

const cache: map<Promise<configuration>> = {}
const MOODLE_DOMAINS_HOME = path.resolve(
  process.cwd(),
  process.env.MOODLE_DOMAINS_HOME ?? DEFAULT_DOMAINS_HOME_DIR_NAME,
)

export const default_configurator: configurator = async ({ access_session }) => {
  const domainName = access_session.domain
  // const normalized_domain = domainName.split(':')[0]!.replace(/:/g, '_')
  if (!cache[domainName]) {
    cache[domainName] = new Promise<configuration>(resolveConfiguration => {
      //SHAREDLIB: `currentDomainDir` is constructed in pri/file-server/src/main.ts too ! need to share this logic
      const currentDomainDir = path.resolve(MOODLE_DOMAINS_HOME, sanitizeFileName(domainName))

      dotenvExpand(dotenv.config({ path: path.join(currentDomainDir, '.env'), override: true }))
      //      console.log({ env_home, env: Object.fromEntries(Object.entries(process.env).filter(([n]) => n.startsWith('MOOD'))) })

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
        inspect({ MOODLE_DOMAINS_HOME, ...env }, { colors: true, sorted: true }),
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
      const sys_admin_info: env.sys_admin_info = {
        email: env.MOODLE_SYS_ADMIN_EMAIL,
      }

      const file_system_storage_sec_env: storageSec.StorageDefaultSecEnv = {
        tempFileMaxRetentionSeconds: env.MOODLE_TEMP_FILE_MAX_RETENTION_SECONDS,
        currentDomainDir,
      }

      const secondary_factories: moodle_secondary_factory[] = [
        // sec modules
        arangoSec.get_arango_persistence_factory(arango_db_env),
        cryptoSec.get_default_crypto_secondarys_factory(crypto_env),
        nodemailerSec.get_nodemailer_secondary_factory(nodemailer_env),
        storageSec.get_storage_default_secondary_factory(file_system_storage_sec_env),
      ]

      const core_factories: moodle_core_factory[] = [
        // core modules
        mod_net.net_core(),
        mod_org.org_core(),
        mod_iam.iam_core(),
        mod_net_webapp_nextjs.net_webapp_nextjs_core(),
        mod_user_home.user_home_core(),
        mod_storage.storage_core(),
        (/* _ctx */) => {
          return {
            primary: {
              env: {
                domain: {
                  async info() {
                    return { name: domainName }
                  },
                },
                application: {
                  async deployments() {
                    return {
                      moodlenetWebapp: deploymentInfoFromUrlString(
                        env.MOODLE_NET_WEBAPP_DEPLOYMENT_URL,
                      ),
                      filestoreHttp: deploymentInfoFromUrlString(
                        env.MOODLE_FILE_SERVER_DEPLOYMENT_URL,
                      ),
                    }
                  },
                },
                maintainance: {
                  async getSysAdminInfo() {
                    return sys_admin_info
                  },
                },
              },
            },
          }
        },
      ]
      let do_start_background_processes = env.MOODLE_CORE_INIT_BACKGROUND_PROCESSES === 'true'
      migrateArangoDB(arango_db_env).then(() => {
        const configuration: configuration = {
          core_factories,
          secondary_factories,
          get start_background_processes() {
            const resp = do_start_background_processes
            do_start_background_processes = false
            return resp
          },
        }
        resolveConfiguration(configuration)
      })
    }).catch(e => {
      delete cache[domainName]
      throw e
    })
  }

  return cache[domainName]
}

export default default_configurator
