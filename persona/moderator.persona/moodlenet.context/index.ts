import { manageReports } from './manageReports.scope'

declare module '..' {
  interface Persona {
    moodlenet: moodlenet
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Context {}

export type moodlenet = moo.persona.context<moo<Context>>
export const moodlenet: moo.gate.provider.context<moodlenet> = {
  manageReports,
}
