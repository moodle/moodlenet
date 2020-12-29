import JWT from 'jsonwebtoken'
import { jwtVerifyOpts, JWT_PUBLIC_KEY } from './GraphQLGateway.env'

export const INVALID_TOKEN = Symbol('INVALID_TOKEN')
export const verifyJwt = (
  token: string | undefined
): MoodleNetExecutionAuth | undefined | typeof INVALID_TOKEN => {
  if (!token) {
    return undefined
  }
  try {
    const executionAuth = JWT.verify(token, JWT_PUBLIC_KEY, jwtVerifyOpts)
    if (typeof executionAuth !== 'object' || !isMoodleNetJwt(executionAuth)) {
      return undefined
    }
    return executionAuth
  } catch {
    return INVALID_TOKEN
  }
}

export type MoodleNetExecutionAuth = {
  accountId: string
  userId: string
  username: string
}
//FIXME: implement proper typeguard
export const isMoodleNetJwt = (_obj: object): _obj is MoodleNetExecutionAuth =>
  true
