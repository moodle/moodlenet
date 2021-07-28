import Argon, { argon2id, hash } from 'argon2'
import { PasswordVerifier } from './types'

type ArgonPwdHashOpts = Parameters<typeof hash>[1]
export const defaultArgonPwdHashOpts: ArgonPwdHashOpts = {
  memoryCost: 100000,
  timeCost: 8,
  parallelism: 4,
  type: argon2id,
}

export const argonHashPassword = async (pwd: string) => {
  return Argon.hash(pwd, defaultArgonPwdHashOpts)
}

export const argonVerifyPassword: PasswordVerifier = async ({ pwdHash, plainPwd }) => {
  return Argon.verify(pwdHash, plainPwd, defaultArgonPwdHashOpts)
}
