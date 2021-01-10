import JWT from 'jsonwebtoken'
import { SessionAccount } from '../UserAccount/UserAccount.graphql.gen'
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

export type MoodleNetExecutionAuth = {
  sessionAccount: SessionAccount // TODO: May prefer to define an independent type for this, mapped from UserAccount#SessionAccount, instead of direct usage
}
//FIXME: implement proper typeguard
export const isMoodleNetExecutionAuth = (
  _obj: object
): _obj is MoodleNetExecutionAuth => true
