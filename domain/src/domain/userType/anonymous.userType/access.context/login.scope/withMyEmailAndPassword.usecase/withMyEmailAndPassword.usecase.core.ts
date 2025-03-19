import { login } from './login.core'
import type { withMyEmailAndPassword as withMyEmailAndPassword_def } from './withMyEmailAndPassword.usecase'
export const withMyEmailAndPassword: moo.def.core.usecase<withMyEmailAndPassword_def> = {
  login,
}
