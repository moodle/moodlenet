import { session } from './session.usecase'

declare module '..' {
  interface Context {
    access: access
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Scope {}

export type access = moo.persona.scope<moo<Scope>>
export const access: moo.def.gate.provider.scope<access> = { session: session }
