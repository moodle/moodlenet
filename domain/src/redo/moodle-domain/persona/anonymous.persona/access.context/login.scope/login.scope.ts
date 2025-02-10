import { withMyEmail, withMyEmail_Gate } from './withMyEmail.usecase/withMyEmail.usecase'

export type loginScope = moo.persona.scope<{ withMyEmail: withMyEmail }>

export const loginScope_Gate: moo.gate.scope<loginScope> = {
  withMyEmail: withMyEmail_Gate,
}
