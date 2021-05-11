import Argon, { argon2id, hash } from 'argon2'
import { PasswordVerifier } from '../../types'

type ArgonPwdHashOpts = Parameters<typeof hash>[1]
export const defaultArgonPwdHashOpts: ArgonPwdHashOpts = {
  memoryCost: 100000,
  timeCost: 8,
  parallelism: 4,
  type: argon2id,
}

export const argonHashPassword = async (_: { pwd: string; argonPwdHashOpts?: ArgonPwdHashOpts }) => {
  const { pwd, argonPwdHashOpts = defaultArgonPwdHashOpts } = _
  return Argon.hash(pwd, argonPwdHashOpts)
}

export const argonVerifyPassword =
  (argonPwdHashOpts = defaultArgonPwdHashOpts): PasswordVerifier =>
  async ({ pwd, pwdhash }) => {
    return Argon.verify(pwdhash, pwd, argonPwdHashOpts)
  }
