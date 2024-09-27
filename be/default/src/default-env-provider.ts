import { DeploymentInfo } from '@moodle/lib-ddd'
import { _any, email_address_schema, map, url_string_schema } from '@moodle/lib-types'
import * as cryptoSec from '@moodle/sec-crypto-default'
import * as arangoSec from '@moodle/sec-db-arango'
import * as nodemailerSec from '@moodle/sec-email-nodemailer'
import { readFileSync } from 'fs'
import * as path from 'path'
import { inspect } from 'util'
import { number, object, string } from 'zod'
import { Env, EnvProvider, EnvProviderResult } from './types'

// import * as argon2 from 'argon2'

const cache: map<Promise<EnvProviderResult>> = {}
const generateEnv: EnvProvider = async ({ access_session, migrate, loadDotEnv }) => {
  const MOODLE_DOMAINS_ENV_HOME = process.env.MOODLE_DOMAINS_ENV_HOME ?? '.moodle.env.home'
  const normalized_domain = access_session.domain.replace(/:/g, '_')
  if (!cache[normalized_domain]) {
    cache[normalized_domain] = new Promise<EnvProviderResult>(resolveEnv => {
      const env_home = path.resolve(MOODLE_DOMAINS_ENV_HOME, normalized_domain)
      loadDotEnv({ path: path.join(env_home, '.env'), override: true })
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
      const env: Env = {
        arango_db: arangoSec.provideEnv({
          env: {
            ...proc_env,
            MOODLE_ARANGODB_ISDEV: `${isDev}`,
            MOODLE_ARANGODB_DB_PREFIX: normalized_domain,
          },
        }),
        crypto: cryptoSec.provideEnv({
          env: { ...proc_env, MOODLE_CRYPTO_PRIVATE_KEY, MOODLE_CRYPTO_PUBLIC_KEY },
        }),
        nodemailer: nodemailerSec.provideEnv({ env: proc_env }),
        deployments: {
          moodle: {
            net: {
              MoodleNetWebappDeploymentInfo: deploymentInfoFromUrlString(
                env_config.MOODLE_NET_WEBAPP_DEPLOYMENT_URL,
              ),
            },
          },
        },
      }

      const migration_status = migrate({
        env,
        configs: {
          db: {
            init: env_config.MOODLE_INITIAL_ADMIN_EMAIL
              ? { moodleInitialAdminEmail: env_config.MOODLE_INITIAL_ADMIN_EMAIL }
              : undefined,
          },
        },
      })

      resolveEnv({ env, migration_status })
    }).catch(e => {
      delete cache[normalized_domain]
      throw e
    })
  }

  return cache[normalized_domain]
}
export default generateEnv

// FIXME: should this be in some lib ! ?
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
function int_schema(dflt: number) {
  return string().transform(Number).pipe(number().positive().int().default(dflt))
}
