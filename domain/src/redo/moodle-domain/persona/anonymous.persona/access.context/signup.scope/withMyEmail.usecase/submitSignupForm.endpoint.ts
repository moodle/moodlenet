import { email_address, redacted } from '@moodle/lib-types'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { flow } from 'fp-ts/function'
import { object } from 'zod'
import { error4xx } from '../../../../../../../types'
import { UserDataConfigs, userDataZodSchemas } from '../../../../any.persona/any.persona'
import { USER_WITH_THIS_EMAIL_EXISTS } from '../consts'
import { SUBMITTED } from '../../../../../../moo/lib/constants'

export type submitSignupForm = moo.persona.endpoint<
  [typeof signupFormZodSchema, E.Either<typeof USER_WITH_THIS_EMAIL_EXISTS, typeof SUBMITTED>, undefined]
>

export type signupForm = {
  email: email_address
  password: redacted<string>
  displayName: string
}

export const submitSignupForm_Gate: moo.gate.endpointProvider<submitSignupForm> = flow(
  O.some,
  O.bind('userDataConfigs', ({ permissions }) => O.fromNullable(permissions.any?._.general.userDataConfigs)),
  O.bind('zod', flow(O.some, O.map(signupFormZodSchema))),
  E.fromOption(() => error4xx('Unauthorized')),
)

export function signupFormZodSchema({ userDataConfigs }: { userDataConfigs: UserDataConfigs }) {
  const { password, userDisplayName, userEmail } = userDataZodSchemas(userDataConfigs)

  const signupFormSchema = object({
    email: userEmail,
    password,
    displayName: userDisplayName,
  })

  return signupFormSchema
}
