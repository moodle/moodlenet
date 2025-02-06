import { email_address_schema, plain_password_schema, single_line_string_schema, valid } from '@moodle/lib-types'
import { string } from 'zod'
import { system, systemGate } from './system.context'

export type any__ = moo.persona<{ system: system }, { general: GeneralDirectives }>

export const anyGate: moo.gate.persona<any__> = {
  system: systemGate,
}

export type UserDataConfigs = {
  email: valid.iMax
  password: valid.iMinMax
  displayName: valid.iMinMax
}

export type GeneralDirectives = {
  userDataConfigs: UserDataConfigs
}

export function userDataZodSchemas(userDataConfigs: UserDataConfigs) {
  const userEmail = string().max(userDataConfigs.email.max).pipe(email_address_schema)
  const password = plain_password_schema(string().min(userDataConfigs.password.min).max(userDataConfigs.password.max))
  const userDisplayName = string()
    .trim()
    .min(userDataConfigs.displayName.min)
    .max(userDataConfigs.displayName.max)
    .pipe(single_line_string_schema)

  return {
    userEmail,
    password,
    userDisplayName,
  }
}
