import type { hash } from 'argon2'
export type ArgonPwdHashOpts = Parameters<typeof hash>[1]
// ArgonPwdHashOpts : {
//   memoryCost: 100000,
//   timeCost: 8,
//   parallelism: 4,
//   type: argon2id,
// }

export type env = {
  alg: string
  type: string
  privateKeyStr: string
  publicKeyStr: string
  domain: string
  argonOpts: ArgonPwdHashOpts
}
