import { readFile } from 'fs/promises'
import * as jose from 'jose'
import { KeyLike } from 'jose'
import { shell } from './shell.mjs'
import { Configs } from './types.mjs'

export const env = await getEnv()

async function getEnv(): Promise<Configs & { keyLikes: { private: KeyLike; public: KeyLike } }> {
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

  return {
    keyLikes: { private: privateKeyLike, public: publicKeyLike },
    ...config,
  }
}
