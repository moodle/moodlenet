import { readFile } from 'fs/promises'
import type { KeyLike } from 'jose'
import * as jose from 'jose'
import { shell } from './shell.mjs'

export const env = await getEnv()

// console.log(inspect({ pr: env.keyLikes.private, pu: env.keyLikes.public }, true, 10, true))
type Configs = {
  keys: {
    alg: string
    type: string
    private: string
    public: string
  }
}
async function getEnv(): Promise<
  Configs & { jwk: jose.JWK; keyLikes: { private: KeyLike; public: KeyLike } }
> {
  //FIXME: validate configs
  const config: Configs = {
    keys: shell.config.keys,
  }
  if (config.keys.type !== 'PKCS8') {
    throw new Error(`unsupported key type ${config.keys.type} - only PKCS8 supported now`)
  }

  const [privateKeyStr, publicKeyStr] = await Promise.all([
    readFile(config.keys.private, 'utf-8'),
    readFile(config.keys.public, 'utf-8'),
  ])

  const [privateKeyLike, publicKeyLike] = await Promise.all([
    jose.importPKCS8(privateKeyStr, config.keys.alg),
    jose.importSPKI(publicKeyStr, config.keys.alg),
  ])

  const jwk = await jose.exportJWK(privateKeyLike)
  return {
    keyLikes: { private: privateKeyLike, public: publicKeyLike },
    jwk,
    ...config,
  }
}
