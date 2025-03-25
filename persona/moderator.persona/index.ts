/* eslint-disable @typescript-eslint/no-namespace */
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

export const moderator: moo.gate.provider.persona<moderator> = {
  moodlenet,
}
