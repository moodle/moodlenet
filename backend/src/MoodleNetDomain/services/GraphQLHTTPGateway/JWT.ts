import JWT from 'jsonwebtoken'
import {
  isMoodleNetExecutionAuth,
  MoodleNetExecutionAuth,
} from '../../MoodleNetGraphQL'
import { jwtVerifyOpts, JWT_PUBLIC_KEY } from './GraphQLHTTPGateway.env'

export const INVALID_TOKEN = Symbol('INVALID_TOKEN')
export type INVALID_TOKEN = typeof INVALID_TOKEN
export const verifyJwt = (
  token: any
): MoodleNetExecutionAuth | null | INVALID_TOKEN => {
  if (!token) {
    return null
  }
  try {
    const executionAuth = JWT.verify(
      String(token),
      JWT_PUBLIC_KEY,
      jwtVerifyOpts
    )
    if (
      typeof executionAuth !== 'object' ||
      !isMoodleNetExecutionAuth(executionAuth)
    ) {
      return null
    }
    return executionAuth
  } catch {
    return INVALID_TOKEN
  }
}
