import { valid } from '@moodle/lib-types'
import { userBase, userBase_Gate } from './userBase.context/userBase.context'

export type admin = moo.persona<{
  userBase: userBase
  [moo.persona.configs]: adminPersonaConfigs
}>

export const admin_Gate: moo.gate.persona<admin> = {
  userBase: userBase_Gate,
}

export type adminPersonaValidationConfigs = {
  personaType: valid.iMinMax
}

type adminPersonaConfigs = {
  validation: adminPersonaValidationConfigs
}
