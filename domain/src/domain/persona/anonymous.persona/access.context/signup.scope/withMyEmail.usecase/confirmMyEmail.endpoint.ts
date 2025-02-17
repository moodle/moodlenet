import { signed_token, signed_token_schema } from '@moodle/lib-types'
import * as E from 'fp-ts/Either'
import { flow } from 'fp-ts/function'
import { object } from 'zod'
import { SUBMITTED } from '../../../../../../lib/constants'
import { TYPE_INVALID_TOKEN } from '../../../../../model/jwtTokens.model/consts'
import { USER_WITH_THIS_EMAIL_EXISTS } from '../consts'
// import { Error4xx } from '../../../../../../moo/lib/access-error'

export type confirmMyEmail = moo.persona.endpoint<
  [
    typeof confirmEmailFormZodSchema,
    E.Either<typeof USER_WITH_THIS_EMAIL_EXISTS | TYPE_INVALID_TOKEN, typeof SUBMITTED>,
    // { cfgA: string },
    // { ctxA: string },
  ]
>

export type confirmEmailForm = { signupEmailVerificationToken: signed_token }

export const confirmMyEmail: moo.gate.provider.endpoint<confirmMyEmail> = flow(
  E.right,
  E.bind('zod', flow(E.right, E.map(confirmEmailFormZodSchema))),
  // E.bind('context', ({ configs }) =>
  //   E.right({
  //     check: ({ context }) => (context.ctxA ? undefined : new Error4xx('Bad Request')),
  //     preflight: ({ form, context }) => (form.signupEmailVerificationToken ? undefined : new Error4xx('Bad Request')),
  //   }),
  // ),
)

export function confirmEmailFormZodSchema() {
  const confirmEmailFormSchema = object({
    signupEmailVerificationToken: signed_token_schema,
  })

  return confirmEmailFormSchema
}
