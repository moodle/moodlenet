import { core_factory, DeploymentInfo, DomainDeployments, sec_factory } from '@moodle/lib-ddd'
import { _any, email_address_schema, map, url_string_schema } from '@moodle/lib-types'
import * as mod_iam from '@moodle/mod-iam'
import * as mod_net from '@moodle/mod-net'
import * as mod_net_webapp_nextjs from '@moodle/mod-net-webapp-nextjs'
import * as mod_org from '@moodle/mod-org'
import * as cryptoSec from '@moodle/sec-crypto-default'
import * as arangoSec from '@moodle/sec-db-arango'
import * as nodemailerSec from '@moodle/sec-email-nodemailer'
import dotenv from 'dotenv'
import { expand as dotenvExpand } from 'dotenv-expand'
import { readFileSync } from 'fs'
import * as path from 'path'
import { inspect } from 'util'
import { object } from 'zod'
import { Configuration, Configurator } from './types'
// import * as argon2 from 'argon2'

const cache: map<Promise<Configuration>> = {}
const MOODLE_DOMAINS_ENV_HOME = process.env.MOODLE_DOMAINS_ENV_HOME ?? '.moodle.env.home'

export const default_configurator: Configurator = async ({ access_session }) => {
  const normalized_domain = access_session.domain.replace(/:/g, '_')
  if (!cache[normalized_domain]) {
    cache[normalized_domain] = new Promise<Configuration>(resolveConfiguration => {
      const env_home = path.resolve(MOODLE_DOMAINS_ENV_HOME, normalized_domain)
      dotenvExpand(dotenv.config({ path: path.join(env_home, '.env'), override: true }))
      //      console.log({ env_home, env: Object.fromEntries(Object.entries(process.env).filter(([n]) => n.startsWith('MOOD'))) })

      const isDev = process.env.NODE_ENV === 'development'

      const env_config = object({
        MOODLE_INITIAL_ADMIN_EMAIL: email_address_schema.optional(),
        MOODLE_NET_WEBAPP_DEPLOYMENT_URL: url_string_schema,
      }).parse({
        MOODLE_INITIAL_ADMIN_EMAIL: process.env.MOODLE_INITIAL_ADMIN_EMAIL,
        MOODLE_NET_WEBAPP_DEPLOYMENT_URL: process.env.MOODLE_NET_WEBAPP_DEPLOYMENT_URL,
      })
      console.info(
        `domain [${normalized_domain}] env:`,
        inspect({ MOODLE_DOMAINS_ENV_HOME, ...env_config }, { colors: true, sorted: true }),
      )
      const MOODLE_CRYPTO_PRIVATE_KEY = readFileSync(path.join(env_home, `private.key`), 'utf8')
      const MOODLE_CRYPTO_PUBLIC_KEY = readFileSync(path.join(env_home, `public.key`), 'utf8')
      const proc_env = process.env as _any

      const arango_db_env: arangoSec.ArangoDbSecEnv = arangoSec.provideEnv({
        env: {
          ...proc_env,
          MOODLE_ARANGODB_ISDEV: `${isDev}`,
          MOODLE_ARANGODB_DB_PREFIX: normalized_domain,
        },
      })
      const crypto_env: cryptoSec.CryptoDefaultEnv = cryptoSec.provideEnv({
        env: { ...proc_env, MOODLE_CRYPTO_PRIVATE_KEY, MOODLE_CRYPTO_PUBLIC_KEY },
      })
      const nodemailer_env: nodemailerSec.NodemailerSecEnv = nodemailerSec.provideEnv({
        env: proc_env,
      })
      const deployments: DomainDeployments = {
        moodle: {
          net: {
            MoodleNetWebappDeploymentInfo: deploymentInfoFromUrlString(
              env_config.MOODLE_NET_WEBAPP_DEPLOYMENT_URL,
            ),
          },
        },
      }
      const core_factories: core_factory[] = [
        // core modules
        mod_net.core(),
        mod_org.core(),
        mod_iam.core(),
        mod_net_webapp_nextjs.core(),
        () => ({}),
      ]

      const sec_factories: sec_factory[] = [
        // sec modules
        arangoSec.get_arango_persistence_factory(arango_db_env),
        cryptoSec.get_default_crypto_secondarys_factory(crypto_env),
        nodemailerSec.get_nodemailer_secondarys_factory(nodemailer_env),
        () => ({
          env: {
            deployments: {
              v1_0: {
                sec: {
                  info: {
                    async read() {
                      return deployments
                    },
                  },
                },
              },
            },
          },
        }),
      ]
      resolveConfiguration({ core_factories, sec_factories })
    }).catch(e => {
      delete cache[normalized_domain]
      throw e
    })
  }

  return cache[normalized_domain]
}

export default default_configurator

// // FIXME: should this be in some lib ! ?
function deploymentInfoFromUrlString(urlStr: string) {
  const url = new URL(urlStr)
  // const basePath = url.pathname.replace(/[(^\/)(\/$)]/g, '')
  const pathname = url.pathname
  const hostname = url.hostname
  const port = url.port
  const protocol = url.protocol
  // console.log('env_provider_secondarys_factory', {
  //   url,
  //   pathname,
  //   hostname,
  //   port,
  //   protocol,
  // })

  const info: DeploymentInfo = {
    basePath: pathname,
    hostname,
    port,
    protocol,
  }
  return info
}
