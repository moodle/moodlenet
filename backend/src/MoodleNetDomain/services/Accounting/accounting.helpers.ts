import Argon from 'argon2'
import JWT, { SignOptions } from 'jsonwebtoken'
import { MoodelNetJwt } from '../../JWT'
import { EmailObj } from '../Email/types'
import { ArgonPwdHashOpts, jwtSignBaseOpts, JWT_PRIVATE_KEY } from './accounting.env'
import { EmailTemplate } from './persistence/types'
import dot from 'dot'

export const hashPassword = (_: { pwd: string }) => {
  const { pwd } = _
  const hashedPassword = Argon.hash(pwd, ArgonPwdHashOpts)
  return hashedPassword
}

export const verifyPassword = (_: { hash: string; pwd: string | Buffer }) => {
  const { pwd, hash } = _
  const hashedPassword = Argon.verify(hash, pwd, ArgonPwdHashOpts)
  return hashedPassword
}

export const signJwt = (_: { payload: MoodelNetJwt; opts?: SignOptions }) => {
  const { payload, opts } = _
  return JWT.sign(payload, JWT_PRIVATE_KEY, {
    ...jwtSignBaseOpts,
    ...opts,
  })
}

export const fillEmailTemplate = <Vars>(_: {
  template: EmailTemplate<Vars>
  to: string
  vars: Vars
  type?: 'text' | 'html'
}): EmailObj => {
  const { template, to, vars, type = 'html' } = _
  const tplString = template[type]
  const msg = { [type]: tplString && dot.compile(tplString)(vars) }
  return {
    ...template,
    ...msg,
    to,
  }
}
