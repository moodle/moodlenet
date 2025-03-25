import { resetMyPassword } from './resetMyPassword.usecase/resetMyPassword.usecase.core'
import { withMyEmailAndPassword } from './withMyEmailAndPassword.usecase/withMyEmailAndPassword.usecase.core'
import type { login as login_def } from '.'
export const login: moo.core.scope<login_def> = {
  resetMyPassword,
  withMyEmailAndPassword,
}
