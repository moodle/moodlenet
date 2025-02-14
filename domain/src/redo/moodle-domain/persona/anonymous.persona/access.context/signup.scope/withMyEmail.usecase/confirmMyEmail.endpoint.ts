import { signed_token, signed_token_schema } from '@moodle/lib-types'
import * as E from 'fp-ts/Either'
import { flow } from 'fp-ts/function'
import { object } from 'zod'
import { TYPE_INVALID_TOKEN } from '../../../../../model/jwtTokens.model/consts'
import { USER_WITH_THIS_EMAIL_EXISTS } from '../consts'
import { SUBMITTED } from '../../../../../../moo/lib/constants'

export type confirmMyEmail = moo.persona.endpoint<
  [
    typeof confirmEmailFormZodSchema,
    E.Either<typeof USER_WITH_THIS_EMAIL_EXISTS | TYPE_INVALID_TOKEN, typeof SUBMITTED>,
    undefined,
    // {
    //   z: (_: { a: number }) => boolean
    // },
  ]
>

export type confirmEmailForm = { signupEmailVerificationToken: signed_token }

export const confirmMyEmail: moo.gate.endpoint<confirmMyEmail> = flow(
  E.right,
  E.bind('zod', flow(E.right, E.map(confirmEmailFormZodSchema))),
  // E.bind('more', ({ configs }) => E.right({ z: ({ a }) => !!a.toExponential() && !configs })),
)

export function confirmEmailFormZodSchema() {
  const confirmEmailFormSchema = object({
    signupEmailVerificationToken: signed_token_schema,
  })

  return confirmEmailFormSchema
}
