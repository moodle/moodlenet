import { login } from './login.scope/login.scope'
import { signup } from './signup.scope/signup.scope'

export interface Access {
  signup: signup
  login: login
}

export type access = moo.def.userType.context<moo<Access>>
export const access: moo.def.gate.provider.context<access> = {
  signup,
  login,
}
