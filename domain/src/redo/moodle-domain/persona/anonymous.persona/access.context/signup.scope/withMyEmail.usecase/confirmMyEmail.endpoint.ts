import { signed_token, signed_token_schema } from '@moodle/lib-types'
import * as E from 'fp-ts/Either'
import { flow } from 'fp-ts/function'
import * as moo from 'moodle-domain'
import { object } from 'zod'
import { INVALID_TOKEN, SUBMITTED } from '../../../../../../lib/constants'
import { USER_WITH_THIS_EMAIL_EXISTS } from '../consts'

export type confirmMyEmail = moo.DefUseCaseEndpoint<
  [
    moo.ucpl<typeof confirmEmailFormZodSchema>,
    E.Either<typeof USER_WITH_THIS_EMAIL_EXISTS | typeof INVALID_TOKEN, typeof SUBMITTED>,
    undefined,
  ]
>

export type confirmEmailForm = { signupEmailVerificationToken: signed_token }

export const confirmMyEmail_Gate: moo.Gate_Endpoint_Provider<confirmMyEmail> = flow(
  E.right,
  E.bind('zod', flow(E.right, E.map(confirmEmailFormZodSchema))),
)

export function confirmEmailFormZodSchema() {
  const confirmEmailFormSchema = object({
    signupEmailVerificationToken: signed_token_schema,
  })

  return confirmEmailFormSchema
}
