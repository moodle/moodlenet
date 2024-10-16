import type { d_u, email_address, url_string } from '@moodle/lib-types'
import { v1_0 } from './configs'
import { user_id } from './user'
import { userSessionData } from './user-session'

export type signTokenData = v1_0 &
  d_u<
    {
      selfDeletionRequestConfirm: {
        userId: user_id
        redirectUrl: url_string
      }
      resetPasswordRequest: {
        email: email_address
        redirectUrl: url_string
      }
      signupRequestEmailVerification: {
        redirectUrl: url_string
        email: email_address
        passwordHash: string
        displayName: string
      }
      userSession: {
        user: userSessionData
      }
    },
    'type'
  >
