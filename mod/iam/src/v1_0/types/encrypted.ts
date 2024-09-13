import { lib_moodle_iam } from '@moodle/lib-domain'
import { d_u, email_address, url } from '@moodle/lib-types'
import { user_password_hash } from './db'

export type sessionTokenData = d_u<
  {
    selfDeletionRequestConfirm: {
      userId: lib_moodle_iam.v1_0.user_id
      redirectUrl: url
    }
    passwordResetRequest: {
      email: email_address
      redirectUrl: url
    }
    signupRequestEmailVerification: {
      redirectUrl: url
      email: email_address
      passwordHash: user_password_hash
      displayName: string
    }
    userSession: {
      user: lib_moodle_iam.v1_0.UserData
    }
  },
  'v1_0'
>
