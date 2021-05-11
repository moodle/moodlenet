import Argon, { argon2id, hash } from 'argon2'
import { PasswordVerifier } from '../../types'

export const ArgonPwdHashOpts: Parameters<typeof hash>[1] = {
  memoryCost: 100000,
  timeCost: 8,
  parallelism: 4,
  type: argon2id,
}

export const argonHashPassword = async (_: { pwd: string }) => {
  const { pwd } = _
  return await Argon.hash(pwd, ArgonPwdHashOpts)
}

export const argonVerifyPassword: PasswordVerifier = async ({ pwd, pwdhash }) => {
  return Argon.verify(pwdhash, pwd, ArgonPwdHashOpts)
}
