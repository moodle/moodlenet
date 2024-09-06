// import Argon from 'argon2'
import type { hash } from 'argon2'
export type ArgonPwdHashOpts = Parameters<typeof hash>[1]
// ArgonPwdHashOpts : {
//   memoryCost: 100000,
//   timeCost: 8,
//   parallelism: 4,
//   type: argon2id,
// }
