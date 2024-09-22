import { session_token } from '@moodle/lib-ddd'
import {
  _void,
  encrypted_token_payload_data,
  ok_ko,
  ENCRYPTED_TOKEN_PAYLOAD_PROP,
} from '@moodle/lib-types'
import { jwtDecode, JwtPayload } from 'jwt-decode'
import { iamTokenData, sessionUserData } from '../types'

export function noValidationParseUserSessionToken(sessionToken: session_token): ok_ko<
  {
    expired: boolean
    expires: { inSecs: number; date: Date }
    userData: sessionUserData
  },
  void
> {
  try {
    const decoded = jwtDecode<encrypted_token_payload_data<iamTokenData> & JwtPayload>(sessionToken)
    if (!decoded.exp) {
      throw 'no exp!'
    }
    if (decoded[ENCRYPTED_TOKEN_PAYLOAD_PROP].type !== 'userSession') {
      throw 'invalid token'
    }

    const expirationDate = new Date(decoded.exp * 1e3)
    const inSecs = Math.floor((expirationDate.getTime() - Date.now()) / 1000)
    const expired = inSecs <= 0
    const userData = decoded[ENCRYPTED_TOKEN_PAYLOAD_PROP].user
    return [true, { userData, expired, expires: { inSecs, date: expirationDate } }]
  } catch {
    return [false, _void]
  }
}
