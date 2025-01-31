import { email_address_schema, redacted, redacted_schema, single_line_string_schema } from '@moodle/lib-types'
import * as moo from 'moodle-domain'
import { any, string, ZodString } from 'zod'

export type any__ = moo.DefPersona<{
  context: AnyPersonaContext
  services: moo.DefPersonaServices<AnyPersonaServices>
}>

export interface AnyPersonaContext {
  serviceDirectives: serviceDirectives
}

export interface AnyPersonaServices {}

export type plain_password = redacted<string>

export type serviceDirectives = {
  userEmail: { max: number }
  password: { max: number; min: number; regex: null | [regex: string, flags: string] }
  userDisplayName: { max: number; min: number; regex: null | [regex: string, flags: string] }
}

export function serviceDirectivesZodSchemas(serviceDirectives: serviceDirectives) {
  const userEmail = string().max(serviceDirectives.userEmail.max).pipe(email_address_schema)
  const password = redacted_schema(
    string().trim().min(serviceDirectives.password.min).max(serviceDirectives.password.max).pipe(single_line_string_schema),
  )
  const userDisplayName = string()
    .trim()
    .min(serviceDirectives.userDisplayName.min)
    .max(serviceDirectives.userDisplayName.max)
    .pipe(
      serviceDirectives.userDisplayName.regex
        ? string().regex(new RegExp(...serviceDirectives.userDisplayName.regex))
        : (any() as unknown as ZodString),
    )
    .pipe(single_line_string_schema)

  return {
    userEmail,
    password,
    userDisplayName,
  }
}
