/* eslint-disable @typescript-eslint/no-namespace */
import { valid } from '@moodle/lib-types'
import { userBase } from './userBase.context'
declare global {
  namespace moo {
    interface Personas {
      admin: admin
    }
  }
}

export interface Persona {
  [moo.configs]: adminPersonaConfigs
}

export type admin = moo.persona<moo<Persona>>

export const admin: moo.gate.persona<admin> = {
  userBase: userBase,
}

export type adminPersonaValidationConfigs = {
  personaType: valid.iMinMax
}

type adminPersonaConfigs = {
  validation: adminPersonaValidationConfigs
}
