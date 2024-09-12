import { d_u, email_address } from '@moodle/lib-types'
import { user_id } from './data'
import { user_password_hash } from './db'

export type encryptedTokenData = d_u<
  {
    selfDeletionRequestConfirm: {
      userId: user_id
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
