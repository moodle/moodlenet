import { session_token } from '@moodle/domain'
import { _void, d_u, email_address, ok_ko, url } from '@moodle/lib-types'
import { jwtDecode, JwtPayload } from 'jwt-decode'
import { user_id, UserData } from './types'

export type tokenPayloadProp = 'tokenPayload'
export const TOKEN_PAYLOAD_PROP: tokenPayloadProp = 'tokenPayload'

export type session_token_payload_data = {
  [k in tokenPayloadProp]: sessionTokenData
}

export type sessionTokenData = d_u<
  {
    selfDeletionRequestConfirm: {
      userId: user_id
      redirectUrl: url
    }
    passwordResetRequest: {
      email: email_address
      redirectUrl: url
    }
    signupRequestEmailVerification: {
      redirectUrl: url
      email: email_address
      passwordHash: string
      displayName: string
    }
    userSession: {
      user: UserData
    }
  },
  'v1_0'
>

export function noValidationParseUserSessionToken(sessionToken: session_token): ok_ko<
  {
    expired: boolean
    expires: { inSecs: number; date: Date }
    userData: UserData
  },
  void
> {
  try {
    const decoded = jwtDecode<session_token_payload_data & JwtPayload>(sessionToken)
    if (!decoded.exp) {
      throw 'no exp!'
    }
    if (decoded[TOKEN_PAYLOAD_PROP].v1_0 !== 'userSession') {
      throw 'invalid token'
    }

    const expirationDate = new Date(decoded.exp * 1e3)
    const inSecs = Math.floor((expirationDate.getTime() - Date.now()) / 1000)
    const expired = inSecs <= 0
    const userData = decoded[TOKEN_PAYLOAD_PROP].user
    return [true, { userData, expired, expires: { inSecs, date: expirationDate } }]
  } catch {
    return [false, _void]
  }
}
