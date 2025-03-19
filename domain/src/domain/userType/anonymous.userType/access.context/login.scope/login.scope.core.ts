import type { login as login_def } from './login.scope'
import { resetMyPassword } from './resetMyPassword.usecase/resetMyPassword.usecase.core'
import { withMyEmailAndPassword } from './withMyEmailAndPassword.usecase/withMyEmailAndPassword.usecase.core'
export const login: moo.def.core.scope<login_def> = {
  resetMyPassword,
  withMyEmailAndPassword,
}
