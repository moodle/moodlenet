import { readFile } from 'fs/promises'
import type { KeyLike } from 'jose'
import * as jose from 'jose'
import { env } from './env.mjs'

export type Keys = { jwk: jose.JWK; keyLikes: { private: KeyLike; public: KeyLike } }
if (env.keys.type !== 'PKCS8') {
  throw new Error(`unsupported key type ${env.keys.type} - only PKCS8 supported now`)
}
const [privateKeyStr, publicKeyStr] = await Promise.all([
  readFile(env.keys.private, 'utf-8'),
  readFile(env.keys.public, 'utf-8'),
])
const [privateKeyLike, publicKeyLike] = await Promise.all([
  jose.importPKCS8(privateKeyStr, env.keys.alg),
  jose.importSPKI(publicKeyStr, env.keys.alg),
])

export const keyLikes = {
  private: privateKeyLike,
  public: publicKeyLike,
}
export const jwk = await jose.exportJWK(privateKeyLike)
