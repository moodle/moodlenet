import { email_address_schema, redacted, redacted_schema, single_line_string_schema } from '@moodle/lib-types'
import * as moo from 'moodle-domain'
import { any, string, ZodString } from 'zod'

export type any__ = moo.DefPersona<{
  context: AnyPersonaContext
  systems: moo.DefPersonaSystems<AnyPersonaSystems>
}>

export interface AnyPersonaContext {
  systemDirectives: systemDirectives
}

export interface AnyPersonaSystems {}

export type plain_password = redacted<string>

export type systemDirectives = {
  userEmail: { max: number }
  password: { max: number; min: number; regex: null | [regex: string, flags: string] }
  userDisplayName: { max: number; min: number; regex: null | [regex: string, flags: string] }
}

export function systemDirectivesZodSchemas(systemDirectives: systemDirectives) {
  const userEmail = string().max(systemDirectives.userEmail.max).pipe(email_address_schema)
  const password = redacted_schema(
    string().trim().min(systemDirectives.password.min).max(systemDirectives.password.max).pipe(single_line_string_schema),
  )
  const userDisplayName = string()
    .trim()
    .min(systemDirectives.userDisplayName.min)
    .max(systemDirectives.userDisplayName.max)
    .pipe(
      systemDirectives.userDisplayName.regex
        ? string().regex(new RegExp(...systemDirectives.userDisplayName.regex))
        : (any() as unknown as ZodString),
    )
    .pipe(single_line_string_schema)

  return {
    userEmail,
    password,
    userDisplayName,
  }
}
