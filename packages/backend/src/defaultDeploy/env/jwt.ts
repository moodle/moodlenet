import SshPK from 'sshpk'

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY
const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY
const JWT_EXPIRATION_SECS = String(process.env.JWT_EXPIRATION_SECS)

if (!(JWT_PRIVATE_KEY && JWT_EXPIRATION_SECS && JWT_PUBLIC_KEY)) {
  console.error('JWT Env:')
  console.log({ JWT_PRIVATE_KEY, JWT_EXPIRATION_SECS, JWT_PUBLIC_KEY })
  throw new Error(`some env missing or invalid`)
}

SshPK.parseKey(JWT_PRIVATE_KEY, 'pem')
SshPK.parseKey(JWT_PUBLIC_KEY, 'pem')

if (!isFinite(parseInt(JWT_EXPIRATION_SECS))) {
  throw new Error(
    `JWT_EXPIRATION_SECS env var must represent an integer, found "${process.env.JWT_EXPIRATION_SECS}" instead`,
  )
}

const jwtenv = {
  privateKey: JWT_PRIVATE_KEY,
  expirationSecs: parseInt(JWT_EXPIRATION_SECS),
  publicKey: JWT_PUBLIC_KEY,
}

export type JWTEnv = typeof jwtenv

export default jwtenv
