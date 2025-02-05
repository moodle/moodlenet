import { signed_token, signed_token_schema, unbranded } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import * as moo from 'moodle-domain'
import { object, ZodType } from 'zod'
import { INVALID_TOKEN, SUBMITTED } from '../../../../../../lib/constants'
import { USER_WITH_THIS_EMAIL_EXISTS } from '../consts'

export type confirmMyEmail = moo.DefUseCaseEndpoint<
  [confirmEmailForm, Either<typeof USER_WITH_THIS_EMAIL_EXISTS | typeof INVALID_TOKEN, typeof SUBMITTED>, undefined]
>

export type confirmEmailForm = { signupEmailVerificationToken: signed_token }

export function confirmEmailFormZodSchema(): ZodType<unbranded<confirmEmailForm>> {
  const confirmEmailFormSchema = object({
    signupEmailVerificationToken: signed_token_schema,
  })

  return confirmEmailFormSchema
}
