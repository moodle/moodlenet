import { lib_moodle_iam } from '@moodle/lib-domain'
import { d_u, email_address, url } from '@moodle/lib-types'
import { user_password_hash } from './db'
import { UserData } from 'lib/domain/src/moodle/iam/v0_1'

export type encryptedTokenData = d_u<
  {
    selfDeletionRequestConfirm: {
      userId: lib_moodle_iam.v0_1.user_id
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
      user: lib_moodle_iam.v0_1.UserData
    }
  },
  'v0_1'
>
