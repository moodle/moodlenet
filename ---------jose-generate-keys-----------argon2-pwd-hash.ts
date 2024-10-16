import * as jose from 'jose'
// import { existsSync, readFileSync, writeFileSync } from 'fs'
// import Argon from 'argon2'
import type { hash } from 'argon2'
export type ArgonPwdHashOpts = Parameters<typeof hash>[1]
// ArgonPwdHashOpts : {
//   memoryCost: 100000,
//   timeCost: 8,
//   parallelism: 4,
//   type: argon2id,
// }

export async function gen() {
  // joseEnv: {
  //   alg: 'RS256',
  //   type: 'PKCS8',
  //   publicKeyStr,
  //   privateKeyStr,
  // }
  const keysLike = await jose.generateKeyPair('RS256', {
    modulusLength: 2048 /* minimum */,
  })

  //const privateKey = await jose.importPKCS8(keystr.privateKey, alg)

  return {
    privateKey: await jose.exportPKCS8(keysLike.privateKey),
    publicKey: await jose.exportSPKI(keysLike.publicKey),
  }
}
