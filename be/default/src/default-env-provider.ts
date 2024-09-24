import { email_address_schema } from '@moodle/lib-types'
import { Config as ArangoConnectionConfig } from 'arangojs/connection'
import { readFileSync } from 'fs'
import { join } from 'path'
import { Env, EnvProvider, EnvProviderResult } from './types'
// import * as argon2 from 'argon2'

let envProviderResult: Promise<EnvProviderResult>
const generateEnv: EnvProvider = async ({ migrate }) => {
  if (!envProviderResult) {
    envProviderResult = new Promise<EnvProviderResult>(resolveEnv => {
      const MOODLE_CRYPTO_KEY_FILES_DIR = process.env.MOODLE_CRYPTO_KEY_FILES_DIR
      const MOODLE_ARANGO_DB_URL = process.env.MOODLE_ARANGO_DB_URL
      const MOODLE_NODEMAILER_TRANSPORT_URL = process.env.MOODLE_NODEMAILER_TRANSPORT_URL
      const MOODLE_NODEMAILER_SENDER_EMAIL_ADDRESS = email_address_schema.parse(
        process.env.MOODLE_NODEMAILER_SENDER_EMAIL_ADDRESS,
      )
      if (
        !(MOODLE_CRYPTO_KEY_FILES_DIR && MOODLE_ARANGO_DB_URL && MOODLE_NODEMAILER_TRANSPORT_URL)
      ) {
        console.log({
          MOODLE_CRYPTO_KEY_FILES_DIR,
          MOODLE_ARANGO_DB_URL,
          MOODLE_NODEMAILER_TRANSPORT_URL,
        })
        throw new Error('all env vars must be properly set')
      }
      const MOODLE_INITIAL_ADMIN_EMAIL = email_address_schema.parse(
        process.env.MOODLE_INITIAL_ADMIN_EMAIL,
      )

      const privateKeyStr = readFileSync(join(MOODLE_CRYPTO_KEY_FILES_DIR, 'private.key'), 'utf8')
      const publicKeyStr = readFileSync(join(MOODLE_CRYPTO_KEY_FILES_DIR, 'public.key'), 'utf8')
      const baseArangoDbConnection: ArangoConnectionConfig = {
        url: MOODLE_ARANGO_DB_URL,
        keepalive: true,
        retryOnConflict: 5,
        precaptureStackTraces: process.env.NODE_ENV === 'development',
      }

      const env: Env = {
        arango_db: {
          database_connections: {
            mng: {
              ...baseArangoDbConnection,
              databaseName: 'mng',
            },
            data: {
              ...baseArangoDbConnection,
              databaseName: 'data',
            },
            iam: {
              ...baseArangoDbConnection,
              databaseName: 'iam',
            },
          },
        },
        crypto: {
          argonOpts: {
            memoryCost: 100000,
            timeCost: 8,
            parallelism: 4,
            type: 2, // argon2.argon2id,
          },
          joseEnv: {
            alg: 'RS256',
            type: 'PKCS8',
            publicKeyStr,
            privateKeyStr,
          },
        },
        nodemailer: {
          nodemailerTransport: MOODLE_NODEMAILER_TRANSPORT_URL,
          sender: MOODLE_NODEMAILER_SENDER_EMAIL_ADDRESS,
          logWarn: console.warn,
        },
      }

      const migration_status = migrate({
        env,
        configs: {
          db: {
            init: MOODLE_INITIAL_ADMIN_EMAIL
              ? { moodleInitialAdminEmail: MOODLE_INITIAL_ADMIN_EMAIL }
              : undefined,
          },
        },
      })

      resolveEnv({ env, migration_status })
    })
  }

  return envProviderResult
}
export default generateEnv
