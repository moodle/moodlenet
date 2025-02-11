import { session } from './session.scope'

declare module '..' {
  interface Persona {
    system: system
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Context {}

export type system = moo.persona.context<moo.typ<Context>>
export const system: moo.gate.context<system> = {
  session: session,
}
