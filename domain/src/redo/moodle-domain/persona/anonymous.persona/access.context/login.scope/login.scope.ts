import { resetMyPassword, resetMyPassword_Gate } from './resetMyPassword.usecase/resetMyPassword.usecase'
import { withMyEmail, withMyEmail_Gate } from './withMyEmail.usecase/withMyEmail.usecase'

export type loginScope = moo.persona.scope<{ withMyEmail: withMyEmail; resetMyPassword: resetMyPassword }>

export const loginScope_Gate: moo.gate.scope<loginScope> = {
  withMyEmail: withMyEmail_Gate,
  resetMyPassword: resetMyPassword_Gate,
}
