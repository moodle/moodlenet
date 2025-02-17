import { access } from './access.scope'

declare module '..' {
  interface Persona {
    system: system
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Context {}

export type system = moo.persona.context<moo<Context>>
export const system: moo.gate.provider.context<system> = {
  access,
}
