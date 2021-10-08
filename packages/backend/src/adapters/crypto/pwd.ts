import Argon, { argon2id, hash } from 'argon2'
import { SockOf } from '../../lib/stub/Stub'
import { passwordHasher, passwordVerifier } from '../../ports/user-auth/adapters'

export type ArgonPwdHashOpts = Parameters<typeof hash>[1]
export const defaultArgonPwdHashOpts: ArgonPwdHashOpts = {
  memoryCost: 100000,
  timeCost: 8,
  parallelism: 4,
  type: argon2id,
}

export const getPasswordCrypto = (
  opts = defaultArgonPwdHashOpts,
): {
  hasher: SockOf<typeof passwordHasher>
  verifier: SockOf<typeof passwordVerifier>
} => ({
  hasher: async pwd => Argon.hash(pwd, opts),
  verifier: async ({ plainPwd, pwdHash }) => Argon.verify(pwdHash, plainPwd, opts),
})
