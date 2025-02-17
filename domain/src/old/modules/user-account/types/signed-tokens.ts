import type { email_address, url_string } from '@moodle/lib-types'
import { userAccountId } from './user-account-record'
import { profileSessionData, userSessionData } from './user-session'

export type userAccountSignTokenData = {
  selfDeletionRequestConfirm: {
    userAccountId: userAccountId
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
    profile: profileSessionData
  }
}
