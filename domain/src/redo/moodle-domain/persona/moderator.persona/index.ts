/* eslint-disable @typescript-eslint/no-namespace */
import { valid } from '@moodle/lib-types'
import { moodlenet } from './moodlenet.context'
declare global {
  namespace moo {
    interface Personas {
      moderator: moderator
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Persona {}

export type moderator = moo.persona<moo<Persona>>

export const moderator: moo.gate.persona<moderator> = {
  moodlenet,
}

export type moderatorPersonaValidationConfigs = {
  personaType: valid.iMinMax
}
