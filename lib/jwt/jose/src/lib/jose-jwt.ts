import * as jose from 'jose'
import { env } from './types'

export async function getJoseKeys(env: env) {
  if (env.type !== 'PKCS8') {
    throw new Error(`unsupported key type ${env.type} - only PKCS8 supported now`)
  }
  if (env.alg !== 'RS256') {
    throw new Error(`unsupported algorithm ${env.alg} - only RS256 supported now`)
  }

  const [privateKeyLike, publicKeyLike] = await Promise.all([
    jose.importPKCS8(env.privateKeyStr, env.alg),
    jose.importSPKI(env.publicKeyStr, env.alg),
  ])

  const keyLikes = {
    private: privateKeyLike,
    public: publicKeyLike,
  }
  const jwk = await jose.exportJWK(privateKeyLike)
  return { jwk, keyLikes }
}
