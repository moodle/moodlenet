import argon2d from 'argon2'

export type ArgonPwdHashOpts = Parameters<typeof argon2d.hash>[1]
// ArgonPwdHashOpts : {
//   memoryCost: 100000,
//   timeCost: 8,
//   parallelism: 4,
//   type: argon2id,
// }
