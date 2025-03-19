import type { access as access_def } from './access.context'
import { login } from './login.scope/login.scope.core'
import { signup } from './signup.scope/signup.scope.core'
export const access: moo.def.core.context<access_def> = {
  login,
  signup,
}
