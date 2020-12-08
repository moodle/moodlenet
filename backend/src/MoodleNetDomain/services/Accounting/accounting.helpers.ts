import Argon from 'argon2'
import JWT from 'jsonwebtoken'
import { ArgonPwdHashOpts, jwtSignOpts, JWT_PRIVATE_KEY } from './accounting.env'

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
export const signJwt = (payload: any) => {
  return JWT.sign(payload, JWT_PRIVATE_KEY, jwtSignOpts)
}
