import { email_address, redacted } from '@moodle/lib-types'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { flow } from 'fp-ts/function'
import { object } from 'zod'
import { Error4xx } from '../../../../../../lib/access-error'
import { baseUserDataSchemaConfig, generalSchemaConfig } from '../../../../../model/org.model'
import { baseUserDataSchemas, generalSchemas } from '../../../../../model/org.model/lib/schemas'
import { SUBMITTED } from '../../../../../../lib'

export type submitSignupForm = moo.persona.endpoint<[typeof signupFormZodSchema, E.Either<never, typeof SUBMITTED>]>

export type signupForm = {
  email: email_address
  password: redacted<string>
  displayName: string
}

export const submitSignupForm: moo.gate.provider.endpoint<submitSignupForm> = flow(
  O.some,
  O.bind(`general`, ({ permissionsInfo }) => O.fromNullable(permissionsInfo.tree.any?._.schemas.general)),
  O.bind(`baseUserData`, ({ permissionsInfo }) => O.fromNullable(permissionsInfo.tree.any?._.schemas.baseUserData)),
  E.fromOption(() => new Error4xx('Forbidden')),
  E.bind('zod', flow(E.right, E.map(signupFormZodSchema))),
)

export function signupFormZodSchema({ general, baseUserData }: { general: generalSchemaConfig; baseUserData: baseUserDataSchemaConfig }) {
  const generalSchema = generalSchemas({ general })
  const baseUserDataSchema = baseUserDataSchemas({ baseUserData })
  const signupFormSchema = object({
    email: generalSchema.email,
    password: baseUserDataSchema.password,
    displayName: baseUserDataSchema.displayName,
  })

  return signupFormSchema
}
