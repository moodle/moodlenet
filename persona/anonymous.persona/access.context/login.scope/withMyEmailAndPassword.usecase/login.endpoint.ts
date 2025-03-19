import { email_address, redacted, signed_token } from '@moodle/lib-types'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { flow } from 'fp-ts/function'
import { object } from 'zod'
import { Error4xx } from '../../../../../../lib/access-error'
import { baseUserDataSchemaConfig, generalSchemaConfig } from '../../../../../model/org.model'
import { baseUserDataSchemas, generalSchemas } from '../../../../../model/org.model/lib/schemas'
import { WRONG_CREDENTIALS } from '../consts'

export type login = moo.persona.endpoint<[typeof loginFormZodSchema, E.Either<WRONG_CREDENTIALS, { authSessionToken: signed_token }>]>
export const login: moo.gate.provider.endpoint<login> = flow(
  O.some,
  O.bind(`general`, ({ permissionsInfo }) => O.fromNullable(permissionsInfo.tree.any?._.schemas.general)),
  O.bind(`baseUserData`, ({ permissionsInfo }) => O.fromNullable(permissionsInfo.tree.any?._.schemas.baseUserData)),
  E.fromOption(() => new Error4xx('Forbidden')),
  E.bind('zod', flow(E.right, E.map(loginFormZodSchema))),
)

export type loginForm = {
  email: email_address
  password: redacted<string>
}
export function loginFormZodSchema({ general, baseUserData }: { general: generalSchemaConfig; baseUserData: baseUserDataSchemaConfig }) {
  const generalSchema = generalSchemas({ general })
  const baseUserDataSchema = baseUserDataSchemas({ baseUserData })
  const loginFormSchema = object({
    email: generalSchema.email,
    password: baseUserDataSchema.password,
  })

  return loginFormSchema
}
