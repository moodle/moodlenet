import { email_address, redacted, signed_token } from '@moodle/lib-types'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { flow } from 'fp-ts/function'
import { object } from 'zod'
import { error4xx } from '../../../../../../moo/lib/access-error'
import { UserDataConfigs, userDataZodSchemas } from '../../../../any.persona/any.persona'
import { WRONG_CREDENTIALS } from '../consts'

export type login = moo.persona.endpoint<
  [
    typeof loginFormZodSchema,
    E.Either<typeof WRONG_CREDENTIALS, { session: moo.session.user; token: signed_token }>,
    undefined,
  ]
>

export type loginForm = {
  email: email_address
  password: redacted<string>
}

export const login_Gate: moo.gate.endpointProvider<login> = flow(
  O.some,
  O.bind('userDataConfigs', ({ session }) => O.fromNullable(session.any?._.general.userDataConfigs)),
  O.bind('zod', flow(O.some, O.map(loginFormZodSchema))),
  E.fromOption(() => error4xx('Unauthorized')),
)

export function loginFormZodSchema({ userDataConfigs }: { userDataConfigs: UserDataConfigs }) {
  const { password, userEmail } = userDataZodSchemas(userDataConfigs)

  const loginFormSchema = object({
    email: userEmail,
    password,
  })

  return loginFormSchema
}
