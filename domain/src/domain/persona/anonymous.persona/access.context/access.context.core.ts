import { login } from './login.scope/login.scope.core'
import { signup } from './signup.scope/signup.scope.core'
import type { access as accessType } from '.'
export const access: moo.core.context<accessType> ={
  login,
  signup
}
