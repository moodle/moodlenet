/* eslint-disable @typescript-eslint/no-namespace */
import { valid } from '@moodle/lib-types'
import { system } from './system.context'
declare global {
  namespace moo {
    interface Personas {
      any: any__
    }
  }
}

export interface Persona {
  [moo.persona.configs]: anyPersonaConfigs
}

export type any__ = moo.persona<moo.typ<Persona>>

export const any__: moo.gate.persona<any__> = {
  system: system,
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
