import { email_address_schema, plain_password_schema, single_line_string_schema } from '@moodle/lib-types'
import { flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { string } from 'zod'
import { anyPersonaValidationConfigs } from '.'
export const anyPersonaConfigsFlow = ({ session }: { session: moo.session.user }) => O.fromNullable(session.any?._)

export const anyPersonaZodFlow = flow(
  anyPersonaConfigsFlow,
  O.map(anyPersonaConfigs => anyPersonaZodSchemas(anyPersonaConfigs.validation)),
)

export type anyPersonaZodSchemas = ReturnType<typeof anyPersonaZodSchemas>
export function anyPersonaZodSchemas({ baseUserData, general }: anyPersonaValidationConfigs) {
  const userEmail = string().max(general.email.max).pipe(email_address_schema)
  const plainPassword = plain_password_schema(string().min(baseUserData.password.min).max(baseUserData.password.max))
  const userDisplayName = string()
    .trim()
    .min(baseUserData.displayName.min)
    .max(baseUserData.displayName.max)
    .pipe(single_line_string_schema)

  return {
    user: { plainPassword: plainPassword, email: userEmail, displayName: userDisplayName },
    id: string().min(general.id.min).max(general.id.max),
    textSearch: string().min(general.textSearch.min).max(general.textSearch.max),
  }
}
