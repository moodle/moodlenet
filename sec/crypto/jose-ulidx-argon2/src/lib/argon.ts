import Argon from 'argon2'
import { ArgonPwdHashOpts } from './types'

export async function hashPwd({ opts, plainPwd }: { plainPwd: string; opts: ArgonPwdHashOpts }) {
  return Argon.hash(plainPwd, opts)
}

export async function verifyPwd({
  plainPwd,
  pwdHash,
  opts,
}: {
  plainPwd: string
  pwdHash: string
  opts: ArgonPwdHashOpts
}) {
  return Argon.verify(pwdHash, plainPwd, opts)
}
