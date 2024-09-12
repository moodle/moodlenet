import { lib_moodle_iam } from '@moodle/lib-domain'
import { d_u, email_address } from '@moodle/lib-types'
import { user_password_hash } from './db'

export type encryptedTokenData = d_u<
  {
    selfDeletionRequestConfirm: {
      userId: lib_moodle_iam.v0_1.user_id
    }
    passwordResetRequest: {
      email: email_address
    }
    signupRequestEmailVerification: {
      email: email_address
      passwordHash: user_password_hash
      displayName: string
    }
  },
  'v0_1'
>
