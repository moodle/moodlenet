import { DeploymentInfo } from '@moodle/lib-ddd'
import { email_address_schema, map, url_string_schema } from '@moodle/lib-types'
import * as arangoSec from 'arangojs/connection'
import { readFileSync } from 'fs'
import * as path from 'path'
import { inspect } from 'util'
import { literal, number, object, string } from 'zod'
import { Env, EnvProvider, EnvProviderResult } from './types'

// import * as argon2 from 'argon2'

const cache: map<Promise<EnvProviderResult>> = {}
const generateEnv: EnvProvider = async ({ primary_session, migrate, loadDotEnv }) => {
  const MOODLE_DOMAINS_ENV_HOME = process.env.MOODLE_DOMAINS_ENV_HOME ?? '.moodle.env.home'
  const normalized_domain = primary_session.domain.replace(/:/g, '_')
  if (!cache[normalized_domain]) {
    cache[normalized_domain] = new Promise<EnvProviderResult>(resolveEnv => {
      const env_home = path.resolve(MOODLE_DOMAINS_ENV_HOME, normalized_domain)
      loadDotEnv({ path: path.join(env_home, '.env'), override: true })
      //      console.log({ env_home, env: Object.fromEntries(Object.entries(process.env).filter(([n]) => n.startsWith('MOOD'))) })

      const isDev = process.env.NODE_ENV === 'development'

      const env_config = object({
        MOODLE_INITIAL_ADMIN_EMAIL: email_address_schema.optional(),
        MOODLE_ARANGODB_URL: string(),
        MOODLE_ARANGODB_USER: string().optional(),
        MOODLE_ARANGODB_PWD: string().optional(),
        MOODLE_ARANGODB_VERSION: int_schema(31200),
        MOODLE_ARGON_OPTS_MEMORY_COST: int_schema(100000),
        MOODLE_ARGON_OPTS_TIME_COST: int_schema(8),
        MOODLE_ARGON_OPTS_PARALLELISM: int_schema(4),
        MOODLE_ARGON_OPTS_TYPE: literal(0).or(literal(1)).or(literal(2)).optional(),
        MOODLE_SMTP_URL: url_string_schema,
        MOODLE_SMTP_SENDER_NAME: string().optional(),
        MOODLE_SMTP_SENDER_ADDRESS: email_address_schema,
        MOODLE_NET_WEBAPP_DEPLOYMENT_URL: url_string_schema,
      }).parse({
        MOODLE_INITIAL_ADMIN_EMAIL: process.env.MOODLE_INITIAL_ADMIN_EMAIL,
        MOODLE_ARANGODB_URL: process.env.MOODLE_ARANGODB_URL,
        MOODLE_ARANGODB_USER: process.env.MOODLE_ARANGODB_USER,
        MOODLE_ARANGODB_PWD: process.env.MOODLE_ARANGODB_PWD,
        MOODLE_ARANGODB_VERSION: process.env.MOODLE_ARANGODB_VERSION,
        MOODLE_ARGON_OPTS_MEMORY_COST: process.env.MOODLE_ARGON_OPTS_MEMORY_COST,
        MOODLE_ARGON_OPTS_TIME_COST: process.env.MOODLE_ARGON_OPTS_TIME_COST,
        MOODLE_ARGON_OPTS_PARALLELISM: process.env.MOODLE_ARGON_OPTS_PARALLELISM,
        MOODLE_ARGON_OPTS_TYPE: process.env.MOODLE_ARGON_OPTS_TYP,
        MOODLE_SMTP_URL: process.env.MOODLE_SMTP_URL,
        MOODLE_SMTP_SENDER_NAME: process.env.MOODLE_SMTP_SENDER_NAME,
        MOODLE_SMTP_SENDER_ADDRESS: process.env.MOODLE_SMTP_SENDER_ADDRESS,
        MOODLE_NET_WEBAPP_DEPLOYMENT_URL: process.env.MOODLE_NET_WEBAPP_DEPLOYMENT_URL,
      })
      console.info(
        `domain [{$normalized_domain}] env:`,
        inspect({ MOODLE_DOMAINS_ENV_HOME, ...env_config }, { colors: true, sorted: true }),
      )
      const PRIVATE_KEY_STR = readFileSync(path.join(env_home, `private.key`), 'utf8')
      const PUBLIC_KEY_STR = readFileSync(path.join(env_home, `public.key`), 'utf8')

      const baseArangoDbConnection: arangoSec.Config = {
        url: env_config.MOODLE_ARANGODB_URL,
        auth: env_config.MOODLE_ARANGODB_USER
          ? {
              username: env_config.MOODLE_ARANGODB_USER,
              password: env_config.MOODLE_ARANGODB_PWD,
            }
          : undefined,
        arangoVersion: env_config.MOODLE_ARANGODB_VERSION,
        precaptureStackTraces: isDev,
      }
      /** @type {import('../be/default/src/types').Env} */
      const env: Env = {
        arango_db: {
          database_connections: {
            mng: {
              ...baseArangoDbConnection,
              databaseName: `${normalized_domain}_mng`,
            },
            data: {
              ...baseArangoDbConnection,
              databaseName: `${normalized_domain}_data`,
            },
            iam: {
              ...baseArangoDbConnection,
              databaseName: `${normalized_domain}_iam`,
            },
          },
        },
        crypto: {
          argonOpts: {
            memoryCost: env_config.MOODLE_ARGON_OPTS_MEMORY_COST,
            timeCost: env_config.MOODLE_ARGON_OPTS_TIME_COST,
            parallelism: env_config.MOODLE_ARGON_OPTS_PARALLELISM,
            type: env_config.MOODLE_ARGON_OPTS_TYPE,
          },
          joseEnv: {
            alg: 'RS256',
            type: 'PKCS8',
            publicKeyStr: PUBLIC_KEY_STR,
            privateKeyStr: PRIVATE_KEY_STR,
          },
        },
        nodemailer: {
          nodemailerTransport: env_config.MOODLE_SMTP_URL,
          sender: env_config.MOODLE_SMTP_SENDER_NAME
            ? {
                name: env_config.MOODLE_SMTP_SENDER_NAME,
                address: env_config.MOODLE_SMTP_SENDER_ADDRESS,
              }
            : env_config.MOODLE_SMTP_SENDER_ADDRESS,
          logWarn: console.warn,
        },
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
