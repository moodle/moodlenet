import { email_address, redacted } from '@moodle/lib-types'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { flow } from 'fp-ts/function'
import { object } from 'zod'
import { USER_WITH_THIS_EMAIL_EXISTS } from '../consts'
import { SUBMITTED } from '../../../../../../lib/constants'
import { Error4xx } from '../../../../../../lib/access-error'
import { anyPersonaZodFlow, anyPersonaZodSchemas } from '../../../../any.persona/any.gates.helper'

export type submitSignupForm = moo.persona.endpoint<
  [typeof signupFormZodSchema, E.Either<typeof USER_WITH_THIS_EMAIL_EXISTS, typeof SUBMITTED>]
>

export type signupForm = {
  email: email_address
  password: redacted<string>
  displayName: string
}

export const submitSignupForm: moo.gate.provider.endpoint<submitSignupForm> = flow(
  O.some,
  O.bind(`anyPersonaZod`, ({ sessionInfo }) => anyPersonaZodFlow({ sessionInfo })),
  E.fromOption(() => new Error4xx('Forbidden')),
  E.bind('zod', flow(E.right, E.map(signupFormZodSchema))),
)

export function signupFormZodSchema({ anyPersonaZod }: { anyPersonaZod: anyPersonaZodSchemas }) {
  const signupFormSchema = object({
    email: anyPersonaZod.user.email,
    password: anyPersonaZod.user.plainPassword,
    displayName: anyPersonaZod.user.displayName,
  })

  return signupFormSchema
}
