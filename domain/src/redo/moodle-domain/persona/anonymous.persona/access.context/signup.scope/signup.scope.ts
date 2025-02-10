import { withMyEmail, withMyEmail_Gate } from './withMyEmail.usecase/withMyEmail.usecase'

export type signupScope = moo.persona.scope<{ withMyEmail: withMyEmail }>

export const signupScope_Gate: moo.gate.scope<signupScope> = {
  withMyEmail: withMyEmail_Gate,
}
