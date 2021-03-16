import { argon2id, hash } from 'argon2'

export const ArgonPwdHashOpts: Parameters<typeof hash>[1] = {
  memoryCost: 100000,
  timeCost: 8,
  parallelism: 4,
  type: argon2id,
}
