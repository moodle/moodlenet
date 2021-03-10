import Argon from 'argon2'

export const ArgonPwdHashOpts: Parameters<typeof Argon.hash>[1] = {
  memoryCost: 100000,
  timeCost: 8,
  parallelism: 4,
  type: Argon.argon2id,
}
