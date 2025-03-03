import { login } from './login.scope/login.scope.core'
import { signup } from './signup.scope/signup.scope.core'
import type { access as access_def } from '.'
export const access: moo.core.context<access_def> = {
  login,
  signup,
}
