import { email_address_schema, plain_password_schema, single_line_string_schema, valid } from '@moodle/lib-types'
import * as moo from 'moodle-domain'
import { any, string, ZodString } from 'zod'
import { System } from './system.context'

export type any__ = moo.DefPersona<{ system: System }, { general: GeneralDirectives }>

export type UserDataConfigs = {
  email: valid.iMax
  password: valid.iMinMax & valid.regex
  displayName: valid.iMinMax & valid.regex
}

export type GeneralDirectives = {
  userDataConfigs: UserDataConfigs
}

export function userDataZodSchemas(userDataConfigs: UserDataConfigs) {
  const userEmail = string().max(userDataConfigs.email.max).pipe(email_address_schema)
  const password = plain_password_schema(
    string()
      .min(userDataConfigs.password.min)
      .max(userDataConfigs.password.max)
      .regex(new RegExp(...userDataConfigs.password.regex)),
  )
  const userDisplayName = string()
    .trim()
    .min(userDataConfigs.displayName.min)
    .max(userDataConfigs.displayName.max)
    .pipe(
      userDataConfigs.displayName.regex
        ? string().regex(new RegExp(...userDataConfigs.displayName.regex))
        : (any() as unknown as ZodString),
    )
    .pipe(single_line_string_schema)

  return {
    userEmail,
    password,
    userDisplayName,
  }
}
