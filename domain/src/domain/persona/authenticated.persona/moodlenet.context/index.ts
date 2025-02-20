import { contribute } from './contribute.scope'
import { curateContent } from './curateContent.scope'
import { exchangeWithLms } from './exchangeWithLms.scope'
import { curatePreferences } from './curatePreferences.scope'

declare module '..' {
  interface Persona {
    moodlenet: moodlenet
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Context {}
export type moodlenet = moo.persona.context<moo<Context>>
export const moodlenet: moo.gate.provider.context<moodlenet> = {
  contribute,
  curateContent,
  exchangeWithLms,
  curatePreferences,
}
