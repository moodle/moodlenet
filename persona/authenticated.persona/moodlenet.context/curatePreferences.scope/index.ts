import { search } from './search.usecase'
declare module '..' {
  interface Context {
    curatePreferences: curatePreferences
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Scope {}

export type curatePreferences = moo.persona.scope<moo<Scope>>
export const curatePreferences: moo.gate.provider.scope<curatePreferences> = {
  search,
}
