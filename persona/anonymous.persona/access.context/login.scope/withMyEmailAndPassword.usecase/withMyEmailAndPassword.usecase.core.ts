import type { withMyEmailAndPassword as withMyEmailAndPasswordType } from '.'
import { login } from './login.core'
export const withMyEmailAndPassword: moo.core.usecase<withMyEmailAndPasswordType> = {
  login,
}
