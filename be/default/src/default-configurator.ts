import { moodle_core_factory, moodle_secondary_factory, sys_admin_info } from '@moodle/domain'
import { DeploymentInfo, deploymentInfoFromUrlString } from '@moodle/lib-ddd'
import { _any, email_address_schema, map, url_string_schema } from '@moodle/lib-types'
import * as mod_iam from '@moodle/mod-iam'
import * as mod_net from '@moodle/mod-net'
import * as mod_net_webapp_nextjs from '@moodle/mod-net-webapp-nextjs'
import * as mod_org from '@moodle/mod-org'
import * as fsStorage from '@moodle/sec-storage-file-system'
import * as cryptoSec from '@moodle/sec-crypto-default'
import * as arangoSec from '@moodle/sec-db-arango'
import * as nodemailerSec from '@moodle/sec-email-nodemailer'
import dotenv from 'dotenv'
import { expand as dotenvExpand } from 'dotenv-expand'
import { readFileSync } from 'fs'
import * as path from 'path'
import { inspect } from 'util'
import { literal, object } from 'zod'
import { configuration, configurator } from './types'
import { migrateArangoDB } from '@moodle/sec-db-arango/migrate'
// import * as argon2 from 'argon2'

const cache: map<Promise<configuration>> = {}
const MOODLE_DOMAINS_ENV_HOME = process.env.MOODLE_DOMAINS_ENV_HOME ?? '.moodle.env.home'

export const default_configurator: configurator = async ({ access_session }) => {
  const normalized_domain = access_session.domain.replace(/:/g, '_')
  if (!cache[normalized_domain]) {
    cache[normalized_domain] = new Promise<configuration>(resolveConfiguration => {
      const env_home = path.resolve(MOODLE_DOMAINS_ENV_HOME, normalized_domain)
      dotenvExpand(dotenv.config({ path: path.join(env_home, '.env'), override: true }))
      //      console.log({ env_home, env: Object.fromEntries(Object.entries(process.env).filter(([n]) => n.startsWith('MOOD'))) })

      const isDev = process.env.NODE_ENV === 'development'

      const env = object({
        MOODLE_CORE_INIT_BACKGROUND_PROCESSES: literal('true').or(literal('false')).optional(),
        MOODLE_SYS_ADMIN_EMAIL: email_address_schema,
        MOODLE_NET_WEBAPP_DEPLOYMENT_URL: url_string_schema,
      }).parse({
        MOODLE_CORE_INIT_BACKGROUND_PROCESSES: process.env.MOODLE_CORE_INIT_BACKGROUND_PROCESSES,
        MOODLE_SYS_ADMIN_EMAIL: process.env.MOODLE_SYS_ADMIN_EMAIL,
        MOODLE_NET_WEBAPP_DEPLOYMENT_URL: process.env.MOODLE_NET_WEBAPP_DEPLOYMENT_URL,
      })

      console.info(
        `domain [${normalized_domain}] env:`,
        inspect({ MOODLE_DOMAINS_ENV_HOME, ...env }, { colors: true, sorted: true }),
      )
      const MOODLE_CRYPTO_PRIVATE_KEY = readFileSync(path.join(env_home, `private.key`), 'utf8')
      const MOODLE_CRYPTO_PUBLIC_KEY = readFileSync(path.join(env_home, `public.key`), 'utf8')
      const _process_env = process.env as _any

      const arango_db_env: arangoSec.ArangoDbSecEnv = arangoSec.provideEnv({
        env: {
          ..._process_env,
          MOODLE_ARANGODB_ISDEV: `${isDev}`,
          MOODLE_ARANGODB_DB_PREFIX: normalized_domain,
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
      const file_system_storage_sec_env: fsStorage.FileSystemStorageSecEnv = {
        fsHomeDir: path.join(env_home, 'fs-storage'),
      }

      const secondary_factories: moodle_secondary_factory[] = [
        // sec modules
        arangoSec.get_arango_persistence_factory(arango_db_env),
        cryptoSec.get_default_crypto_secondarys_factory(crypto_env),
        nodemailerSec.get_nodemailer_secondary_factory(nodemailer_env),
        fsStorage.get_file_system_storage_factory(file_system_storage_sec_env),
      ]

      const core_factories: moodle_core_factory[] = [
        // core modules
        mod_net.net_core(),
        mod_org.org_core(),
        mod_iam.iam_core(),
        mod_net_webapp_nextjs.net_webapp_nextjs_core(),
        (/* _ctx */) => {
          return {
            primary: {
              env: {
                application: {
                  async deployment({ app }) {
                    const app_url =
                      app === 'moodlenet-webapp' ? env.MOODLE_NET_WEBAPP_DEPLOYMENT_URL : null
                    if (!app_url) {
                      return null
                    }
                    return deploymentInfoFromUrlString(app_url)
                  },
                  async fsHomeDir() {
                    return { path: env_home }
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
      migrateArangoDB(arango_db_env, { moodlesysAdminEmail: env.MOODLE_SYS_ADMIN_EMAIL }).then(
        () => {
          resolveConfiguration({
            core_factories,
            secondary_factories,
            start_background_processes: env.MOODLE_CORE_INIT_BACKGROUND_PROCESSES === 'true',
          })
        },
      )
    }).catch(e => {
      delete cache[normalized_domain]
      throw e
    })
  } else {
    ;(await cache[normalized_domain]).start_background_processes = false
  }

  return cache[normalized_domain]
}

export default default_configurator

