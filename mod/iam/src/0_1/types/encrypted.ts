import { __redacted__, d_u, email_address } from '@moodle/lib-types'
import { signupForm } from '../lib/js'
import { user_id } from './data'

export type encryptedTokenData = d_u<
  {
    selfDeletionConfirm: {
      userId: user_id
    }
    passwordReset: {
      email: email_address
    }
    signupEmailVerification: {
      signupForm: __redacted__<signupForm>
    }
  },
  'v0_1'
>
