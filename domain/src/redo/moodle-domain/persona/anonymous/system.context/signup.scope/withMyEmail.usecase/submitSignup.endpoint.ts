import { email_address, redacted } from '@moodle/lib-types'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { flow } from 'fp-ts/function'
import * as moo from 'moodle-domain'
import { object } from 'zod'
import { error4xx } from '../../../../../../../types'
import { SUBMITTED } from '../../../../../../lib/constants'
import { UserDataConfigs, userDataZodSchemas } from '../../../../any/any.persona'
import { USER_WITH_THIS_EMAIL_EXISTS } from '../consts'

export type submitSignup = moo.DefUseCaseEndpoint<
  [signupForm, E.Either<typeof USER_WITH_THIS_EMAIL_EXISTS, typeof SUBMITTED>, undefined]
>

export type signupForm = {
  email: email_address
  password: redacted<string>
  displayName: string
}

export const signupFormZod = flow(
  O.some<{ userAccess: moo.UserAccess }>,
  O.bind('userDataConfigs', ({ userAccess }) => O.fromNullable(userAccess.any?._.general.userDataConfigs)),
  O.map(({ userDataConfigs }) => signupFormZodSchema(userDataConfigs)),
  E.fromOption(() => error4xx('Unauthorized')),
)

export const submitSignupGateProvider: moo.Gate_Either_Endpoint_Provider<submitSignup> = flow(
  E.right<{ userAccess: moo.UserAccess }>,
  E.bind('zod', signupFormZod),
  E.map(({ zod }) => ({ zod }) /* satisfies moo.Gate_Endpoint<submitSignup>, */),
)

export function signupFormZodSchema(userDataConfigs: UserDataConfigs) {
  const { password, userDisplayName, userEmail } = userDataZodSchemas(userDataConfigs)

  const signupFormSchema = object({
    email: userEmail,
    password,
    displayName: userDisplayName,
  })

  return signupFormSchema
}
