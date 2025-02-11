import { get } from './get.usecase/get.usecase'

declare module '..' {
  interface Context {
    session: session
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Scope {}

export type session = moo.persona.scope<moo.typ<Scope>>
export const session: moo.gate.scope<session> = { get: get }
