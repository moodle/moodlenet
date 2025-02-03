import { email_address_schema, redacted, redacted_schema, single_line_string_schema } from '@moodle/lib-types'
import * as moo from 'moodle-domain'
import { any, string, ZodString } from 'zod'

export type any__ = moo.DefPersona<{
  context: AnyPersonaContext
  scope: moo.DefPersonaScopes<never>
}>

export interface AnyPersonaContext {
  generalDirectives: GeneralDirectives
}

export type plain_password = redacted<string>

export type GeneralDirectives = {
  user: {
    email: { max: number }
    password: { max: number; min: number; regex: null | [regex: string, flags: string] }
    displayName: { max: number; min: number; regex: null | [regex: string, flags: string] }
  }
}

export function generalDirectivesZodSchemas({ user }: GeneralDirectives) {
  const userEmail = string().max(user.email.max).pipe(email_address_schema)
  const password = redacted_schema(
    string().trim().min(user.password.min).max(user.password.max).pipe(single_line_string_schema),
  )
  const userDisplayName = string()
    .trim()
    .min(user.displayName.min)
    .max(user.displayName.max)
    .pipe(user.displayName.regex ? string().regex(new RegExp(...user.displayName.regex)) : (any() as unknown as ZodString))
    .pipe(single_line_string_schema)

  return {
    userEmail,
    password,
    userDisplayName,
  }
}
