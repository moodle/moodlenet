import { existsSync, readFileSync, writeFileSync } from 'fs'
import * as jose from 'jose'
import { EnvProvider, EnvType } from './types'
// import * as argon2 from 'argon2'
const envProvider: EnvProvider = async () => {
  const cryptoParams = {
    alg: 'RS256',
    type: 'PKCS8',
  }
  const defaultCryptoFileNames = {
    private: './.ignore/crypto.privateKey',
    public: './.ignore/crypto.publicKey',
  }
  const privateKeyFileExists = existsSync(defaultCryptoFileNames.private)
  const publicKeyFileExists = existsSync(defaultCryptoFileNames.public)

  const keysToWrite = await (async () => {
    const keysLike = await jose.generateKeyPair(cryptoParams.alg, {
      modulusLength: 2048 /* minimum */,
    })

    //const privateKey = await jose.importPKCS8(keystr.privateKey, alg)
    // console.log(inspect({ keysLike1 }))
    return {
      privateKey: !privateKeyFileExists && (await jose.exportPKCS8(keysLike.privateKey)),
      publicKey: !publicKeyFileExists && (await jose.exportSPKI(keysLike.publicKey)),
    }
  })()

  if (!publicKeyFileExists && keysToWrite.publicKey) {
    writeFileSync(defaultCryptoFileNames.public, keysToWrite.publicKey, 'utf-8')
  }
  if (!privateKeyFileExists && keysToWrite.privateKey) {
    writeFileSync(defaultCryptoFileNames.private, keysToWrite.privateKey, 'utf-8')
  }

  const arangoDbUrl = 'http://127.0.0.1:8529'
  const env: EnvType = {
    arango_db: {
      dbs_struct_configs: {
        mng: {
          url: arangoDbUrl,
          dbname: 'mng',
        },
        data: {
          url: arangoDbUrl,
          dbname: 'data',
        },
        iam: {
          url: arangoDbUrl,
          dbname: 'iam',
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
        publicKeyStr: readFileSync(defaultCryptoFileNames.public, 'utf8'),
        privateKeyStr: readFileSync(defaultCryptoFileNames.private, 'utf8'),
      },
    },
    nodemailer: {
      nodemailerTransport: 'smtps://itonan:vpmyeunbbldcfdiu@smtp.gmail.com/',
      logWarn: console.warn,
      // "__development_env__send_all_emails_to": "alessandro.giansanti@gmail.com"
      // "nodemailerTransport": {
      //   "jsonTransport": true
      // },
    },
  }
  return env
}
module.exports = envProvider
