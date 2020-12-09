import JWT from 'jsonwebtoken'
import { jwtVerifyOpts, JWT_PUBLIC_KEY } from './domain.env'
import { isMoodelNetJwt, MoodelNetJwt } from './JWT'

export const INVALID_TOKEN = Symbol('INVALID_TOKEN')
export const verifyJwt = (
  token: string | undefined
): MoodelNetJwt | undefined | typeof INVALID_TOKEN => {
  if (!token) {
    return undefined
  }
  try {
    const jwt = JWT.verify(token, JWT_PUBLIC_KEY, jwtVerifyOpts)
    if (typeof jwt !== 'object' || !isMoodelNetJwt(jwt)) {
      return undefined
    }
    return jwt
  } catch {
    return INVALID_TOKEN
  }
}
