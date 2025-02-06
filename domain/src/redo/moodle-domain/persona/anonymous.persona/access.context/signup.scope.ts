import { withMyEmail, withMyEmailGate } from './signup.scope/withMyEmail.usecase'

export type signup = moo.persona.scope<{ withMyEmail: withMyEmail }>

export const signupGate: moo.gate.scope<signup> = {
  withMyEmail: withMyEmailGate,
}
