import { withMyEmail } from './withMyEmail.usecase'

declare module '..' {
  interface Context {
    signup: signup
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Scope {}

export type signup = moo.persona.scope<moo<Scope>>
export const signup: moo.gate.provider.scope<signup> = {
  withMyEmail,
}
