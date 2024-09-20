import type { d_u, email_address, url } from '@moodle/lib-types'
import type { UserData } from './user'
import type { user_id } from './user-session'

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
