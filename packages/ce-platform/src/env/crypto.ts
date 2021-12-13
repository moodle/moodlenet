import SshPK from 'sshpk'

const CRYPTO_PRIVATE_KEY = process.env.CRYPTO_PRIVATE_KEY
const CRYPTO_PUBLIC_KEY = process.env.CRYPTO_PUBLIC_KEY

if (!(CRYPTO_PRIVATE_KEY && CRYPTO_PUBLIC_KEY)) {
  console.error('CRYPTO Env:')
  console.error({ CRYPTO_PRIVATE_KEY, CRYPTO_PUBLIC_KEY })
  throw new Error(`some env missing or invalid`)
}

SshPK.parseKey(CRYPTO_PRIVATE_KEY, 'pem')
SshPK.parseKey(CRYPTO_PUBLIC_KEY, 'pem')

const cryptoEnv = {
  privateKey: CRYPTO_PRIVATE_KEY,
  publicKey: CRYPTO_PUBLIC_KEY,
}

export type CRYPTOEnv = typeof cryptoEnv

export default cryptoEnv
