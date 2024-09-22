import type { d_u, email_address, url } from '@moodle/lib-types'
import { v1_0 } from './configs'
import { user_id } from './user'
import { sessionUserData } from './user-session'

export type iamTokenData = v1_0 &
  d_u<
    {
      selfDeletionRequestConfirm: {
        userId: user_id
        redirectUrl: url
      }
      resetPasswordRequest: {
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
        user: sessionUserData
      }
    },
    'type'
  >
