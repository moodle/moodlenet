/* eslint-disable @typescript-eslint/no-namespace */
import { baseUserDataSchemaConfig, generalSchemaConfig } from '../../model/org.model'
import { moodlenet } from './moodlenet.context'
import { system } from './system.context'
declare global {
  namespace moo {
    interface Personas {
      any: any__
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Persona {
  [moo.tags.configs]: anyPersonaConfigs
}

export type any__ = moo.persona<moo<Persona>>

export const any__: moo.gate.provider.persona<any__> = {
  system,
  moodlenet,
}

export type anyPersonaConfigs = {
  schemas: {
    general: generalSchemaConfig
    baseUserData: baseUserDataSchemaConfig
  }
}
