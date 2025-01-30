import { Either } from 'fp-ts/Either'
import * as moo from 'moodle-domain'
import { SUBMITTED } from '../../../../../lib/constants'

export type Anonymous_EmailSignup_SystemAccess = moo.DefSystemAccess<{
  useCase: {
    signupWithMyEmail: {
      apply: [emailSignupForm, Either<userWithEmalExists, SUBMITTED>, { max: number }]
    }
  }
}>
