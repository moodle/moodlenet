import { resetMyPassword } from './resetMyPassword.usecase/resetMyPassword.usecase.core'
import { withMyEmailAndPassword } from './withMyEmailAndPassword.usecase/withMyEmailAndPassword.usecase.core'
import type { login as loginType } from '.'
export const login: moo.core.scope<loginType> ={
  resetMyPassword,
  withMyEmailAndPassword
}
