/* eslint-disable @typescript-eslint/no-namespace */
import { valid } from '@moodle/lib-types'
import { system } from './system.context'
import { moodlenet } from './moodlenet.context'
declare global {
  namespace moo {
    interface Personas {
      any: any__
    }
  }
}

export interface Persona {
  [moo.configs]: anyPersonaConfigs
}

export type any__ = moo.persona<moo<Persona>>

export const any__: moo.gate.provider.persona<any__> = {
  system,
  moodlenet,
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
