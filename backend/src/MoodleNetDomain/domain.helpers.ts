import JWT from 'jsonwebtoken'
import { jwtVerifyOpts, JWT_PUBLIC_KEY } from './domain.env'
import { isMoodleNetJwt, MoodleNetExecutionAuth } from './JWT'

export const INVALID_TOKEN = Symbol('INVALID_TOKEN')
export const verifyJwt = (
  token: string | undefined
): MoodleNetExecutionAuth | undefined | typeof INVALID_TOKEN => {
  if (!token) {
    return undefined
  }
  try {
    const jwt = JWT.verify(token, JWT_PUBLIC_KEY, jwtVerifyOpts)
    if (typeof jwt !== 'object' || !isMoodleNetJwt(jwt)) {
      return undefined
    }
    return jwt
  } catch {
    return INVALID_TOKEN
  }
}
