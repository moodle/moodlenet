import { email_address, redacted, signed_token } from '@moodle/lib-types'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { flow } from 'fp-ts/function'
import { object } from 'zod'
import { Error4xx } from '../../../../../../moo/lib/access-error'
import { WRONG_CREDENTIALS } from '../consts'
import { anyPersonaZodFlow, anyPersonaZodSchemas } from '../../../../any.persona/any.gates.helper'

export type login = moo.persona.endpoint<
  [typeof loginFormZodSchema, E.Either<typeof WRONG_CREDENTIALS, { session: moo.session.user; token: signed_token }>]
>
export const login: moo.gate.endpoint<login> = flow(
  O.some,
  O.bind(`anyPersonaZod`, ({ session }) => anyPersonaZodFlow({ session })),
  O.bind('zod', flow(O.some, O.map(loginFormZodSchema))),
  E.fromOption(() => new Error4xx('Unauthorized')),
)

export type loginForm = {
  email: email_address
  password: redacted<string>
}
export function loginFormZodSchema({ anyPersonaZod }: { anyPersonaZod: anyPersonaZodSchemas }) {
  const loginFormSchema = object({
    email: anyPersonaZod.user.email,
    password: anyPersonaZod.user.plainPassword,
  })

  return loginFormSchema
}
