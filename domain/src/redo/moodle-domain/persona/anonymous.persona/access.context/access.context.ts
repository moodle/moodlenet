import { loginScope, loginScope_Gate } from './login.scope/login.scope'
import { signupScope, signupScope_Gate } from './signup.scope/signup.scope'

export type access = moo.persona.context<{ signup: signupScope; login: loginScope }>

export const access_Gate: moo.gate.context<access> = {
  signup: signupScope_Gate,
  login: loginScope_Gate,
}
