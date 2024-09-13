import { CryptoDefaultEnv } from '@moodle/sec-crypto-default'
import { ArangoDbSecEnv } from '@moodle/sec-db-arango'
import { NodemailerSecEnv } from '@moodle/sec-email-nodemailer'
import * as argon2 from 'argon2'
import { readFileSync } from 'fs'

export function get_arango_db_sec_env(): ArangoDbSecEnv {
  return {
    dbs_struct_configs_v1_0: {
      mng: {
        url: process.env.ARANGODB_MNG_URL ?? 'http://127.0.0.1:8529',
        dbname: process.env.ARANGODB_MNG_NAME ?? 'mng',
      },
      data: {
        url: process.env.ARANGODB_DATA_URL ?? 'http://127.0.0.1:8529',
        dbname: process.env.ARANGODB_DATA_NAME ?? 'data',
      },
      iam: {
        url: process.env.ARANGODB_IAM_URL ?? 'http://127.0.0.1:8529',
        dbname: process.env.ARANGODB_IAM_NAME ?? 'iam',
      },
    },
  }
}

export function get_crypto_default_env(): CryptoDefaultEnv {
  return {
    argonOpts: {
      memoryCost: 100000,
      timeCost: 8,
      parallelism: 4,
      type: argon2.argon2id,
    },
    joseEnv: {
      alg: 'RS256',
      type: 'PKCS8',
      privateKeyStr: readFileSync(
        '/home/alec/MOODLENET/repo/mn-fork/.ignore/crypto.privateKey',
        'utf8',
      ),
      publicKeyStr: readFileSync(
        '/home/alec/MOODLENET/repo/mn-fork/.ignore/crypto.publicKey',
        'utf8',
      ),
    },
  }
}

export function get_nodemailer_sec_cfg(): NodemailerSecEnv {
  return {
    nodemailerTransport: 'smtps://itonan:vpmyeunbbldcfdiu@smtp.gmail.com/',
    logWarn: console.warn,
    // "__development_env__send_all_emails_to": "alessandro.giansanti@gmail.com"
    // "nodemailerTransport": {
    //   "jsonTransport": true
    // },
  }
}
