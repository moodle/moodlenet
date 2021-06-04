import SshPK from 'sshpk'
import { startDefaultMoodlenet } from './defaultDeploy'

const httpPort = Number(process.env.HTTP_PORT) || 8080
const mailgunApiKey = process.env.MAILGUN_API_KEY
const mailgunDomain = process.env.MAILGUN_DOMAIN
const arangoUrl = process.env.ARANGO_HOST
const jwtPrivateKey = process.env.JWT_PRIVATE_KEY
const jwtPublicKey = process.env.JWT_PUBLIC_KEY
const jwtExpirationSecs = parseInt(String(process.env.JWT_EXPIRATION_SECS))
const publicBaseUrl = process.env.PUBLIC_URL
const fsAssetRootFolder = process.env.STATICASSETS_FS_ROOT_FOLDER

if (
  !(
    arangoUrl &&
    mailgunApiKey &&
    mailgunDomain &&
    jwtPrivateKey &&
    jwtExpirationSecs &&
    jwtPublicKey &&
    publicBaseUrl &&
    fsAssetRootFolder &&
    httpPort
  )
) {
  console.error('Env:')
  console.log({
    arangoUrl,
    mailgunApiKey,
    mailgunDomain,
    jwtPrivateKey,
    jwtExpirationSecs,
    jwtPublicKey,
    publicBaseUrl,
    fsAssetRootFolder,
    httpPort,
  })
  throw new Error(`missing some env`)
}

SshPK.parseKey(jwtPrivateKey, 'pem')
SshPK.parseKey(jwtPublicKey, 'pem')

if (!isFinite(jwtExpirationSecs)) {
  throw new Error(
    `JWT_EXPIRATION_SECS env var must represent an integer, found "${process.env.JWT_EXPIRATION_SECS}" instead`,
  )
}

startDefaultMoodlenet({
  arangoUrl,
  mailgunApiKey,
  mailgunDomain,
  jwtPrivateKey,
  jwtExpirationSecs,
  jwtPublicKey,
  publicBaseUrl,
  fsAssetRootFolder,
  httpPort,
})
