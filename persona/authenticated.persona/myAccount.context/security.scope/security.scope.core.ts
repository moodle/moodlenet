import { authentication } from './authentication.usecase/authentication.usecase.core'
import type { security as security_def } from '.'
export const security: moo.core.scope<security_def> = {
  authentication,
}
