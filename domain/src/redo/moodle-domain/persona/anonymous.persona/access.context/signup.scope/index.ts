import { withMyEmail } from './withMyEmail.usecase/withMyEmail.usecase'

declare module '..' {
  interface Context {
    signup: signup
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Scope {}

export type signup = moo.persona.scope<moo.typ<Scope>>
export const signup: moo.gate.scope<signup> = {
  withMyEmail: withMyEmail,
}
