import { session } from './session.usecase/session.usecase.core'
import type { access as accessType } from '.'
export const access: moo.core.scope<accessType> ={
  session
}
