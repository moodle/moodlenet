import { mod_id } from '@moodle/core'
import * as jose from 'jose'
import { env } from './types'

export type joseKeys = Awaited<ReturnType<typeof getJoseKeys>>

export async function getJoseKeys(env: env) {
  if (env.type !== 'PKCS8') {
    throw new Error(`unsupported key type ${env.type} - only PKCS8 supported now`)
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

export function audienceByModId(mod_id: mod_id) {
  return `${mod_id.ns}/${mod_id.mod}/${mod_id.version}`
}
