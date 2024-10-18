import type { email_address, url_string } from '@moodle/lib-types'
import { user_id } from './user'
import { userSessionData } from './user-session'

export type iamSignTokenData = {
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
}
