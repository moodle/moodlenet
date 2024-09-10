import { __redacted__, d_u } from '@moodle/lib-types'
import { signupForm } from '../lib'
import { user_id } from './db/db-user'

export type encryptedTokenData = d_u<
  {
    selfDeletionConfirm: {
      userId: user_id
    }
    passwordReset: {
      userId: user_id
    }
    signupEmailVerification: {
      signupForm: __redacted__<signupForm>
    }
  },
  'type_0_1'
>
