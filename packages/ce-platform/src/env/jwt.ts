import SshPK from 'sshpk'

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY
const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY

if (!(JWT_PRIVATE_KEY && JWT_PUBLIC_KEY)) {
  console.error('JWT Env:')
  console.log({ JWT_PRIVATE_KEY, JWT_PUBLIC_KEY })
  throw new Error(`some env missing or invalid`)
}

SshPK.parseKey(JWT_PRIVATE_KEY, 'pem')
SshPK.parseKey(JWT_PUBLIC_KEY, 'pem')

const jwtenv = {
  privateKey: JWT_PRIVATE_KEY,
  publicKey: JWT_PUBLIC_KEY,
}

export type JWTEnv = typeof jwtenv

export default jwtenv
