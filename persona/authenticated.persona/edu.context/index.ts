import { curatePreferences } from './curatePreferences.scope'

declare module '..' {
  interface Persona {
    edu: edu
  }
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Context {}

export type edu = moo.persona.context<moo<Context>>
export const edu: moo.gate.provider.context<edu> = {
  curatePreferences,
}
