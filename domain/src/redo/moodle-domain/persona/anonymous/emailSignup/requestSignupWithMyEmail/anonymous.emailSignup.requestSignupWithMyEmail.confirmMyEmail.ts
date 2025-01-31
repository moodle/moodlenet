import { signed_token, signed_token_schema, unbranded } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import * as moo from 'moodle-domain'
import { object, ZodType } from 'zod'
import { INVALID_TOKEN, SUBMITTED } from '../../../../../lib/constants'
import { USER_WITH_EMAL_EXISTS } from '../consts'

export type Anonymous_EmailSignup_RequestSignupWithMyEmail_confirmMyEmailAndSignup = moo.DefUseCaseEp<
  [confirmEmailForm, Either<USER_WITH_EMAL_EXISTS | INVALID_TOKEN, SUBMITTED>]
>

type confirmEmailForm = { signupEmailVerificationToken: signed_token }

export function zodSchema(): ZodType<unbranded<confirmEmailForm>> {
  const confirmFormSchema = object({
    signupEmailVerificationToken: signed_token_schema,
  })

  return confirmFormSchema
}
