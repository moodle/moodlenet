import type { authentication as authenticationType } from '.'
import { changeMyPassword } from './changeMyPassword.core'
export const authentication: moo.core.usecase<authenticationType> = {
  changeMyPassword,
}
