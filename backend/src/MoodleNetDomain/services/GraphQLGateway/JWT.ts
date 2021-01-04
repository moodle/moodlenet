import JWT from 'jsonwebtoken'
import { SessionAccount } from '../UserAccount/UserAccount.graphql.gen'
import { jwtVerifyOpts, JWT_PUBLIC_KEY } from './GraphQLGateway.env'

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
    if (typeof executionAuth !== 'object' || !isMoodleNetJwt(executionAuth)) {
      return null
    }
    return executionAuth
  } catch {
    return INVALID_TOKEN
  }
}

export type MoodleNetExecutionAuth = {
  sessionAccount: SessionAccount
}
//FIXME: implement proper typeguard
export const isMoodleNetJwt = (_obj: object): _obj is MoodleNetExecutionAuth =>
  true
