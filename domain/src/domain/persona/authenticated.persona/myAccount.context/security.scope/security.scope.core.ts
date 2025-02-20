import { authentication } from './authentication.usecase/authentication.usecase.core'
import type { security as securityType } from '.'
export const security: moo.core.scope<securityType> ={
  authentication
}
