import { email_address_schema, plain_password_schema, single_line_string_schema, valid } from '@moodle/lib-types'
import { string } from 'zod'
import { system, system_Gate } from './system.context/system.context'

export type any__ = moo.persona<{ system: system; [moo.persona.configs]: anyPersonaConfigs }>

export const any_Gate: moo.gate.persona<any__> = {
  system: system_Gate,
}

export type anyPersonaValidationConfigs = {
  general: {
    id: valid.iMinMax
    email: valid.iMax
    textSearch: valid.iMinMax
  }
  baseUserData: {
    password: valid.iMinMax
    displayName: valid.iMinMax
  }
}

export type anyPersonaConfigs = {
  validation: anyPersonaValidationConfigs
}
