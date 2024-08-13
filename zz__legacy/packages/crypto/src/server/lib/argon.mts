import type { hash } from 'argon2'
import Argon from 'argon2'
const { argon2id } = Argon

export type ArgonPwdHashOpts = Parameters<typeof hash>[1]
const defaultArgonPwdHashOpts: ArgonPwdHashOpts = {
  memoryCost: 100000,
  timeCost: 8,
  parallelism: 4,
  type: argon2id,
}

export async function hashPwd(pwd: string | Buffer, opts = defaultArgonPwdHashOpts) {
  return Argon.hash(pwd, opts)
}

export async function verifyPwd({
  plainPwd,
  pwdHash,
  opts = defaultArgonPwdHashOpts,
}: {
  plainPwd: string | Buffer
  pwdHash: string
  opts?: ArgonPwdHashOpts
}) {
  return Argon.verify(pwdHash, plainPwd, opts)
}
