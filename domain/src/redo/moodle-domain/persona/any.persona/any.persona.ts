import { email_address_schema, plain_password_schema, single_line_string_schema, valid } from '@moodle/lib-types'
import { string } from 'zod'
import { system, system_Gate } from './system.context/system.context'

export type any__ = moo.persona<{ system: system; [moo.persona.configs]: { general: GeneralConfigs } }>

export const any_Gate: moo.gate.persona<any__> = {
  system: system_Gate,
}

export type UserDataConfigs = {
  email: valid.iMax
  password: valid.iMinMax
  displayName: valid.iMinMax
}

export type GeneralConfigs = {
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
