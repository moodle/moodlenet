import { email } from './email.scope/email.scope.core'
import type { messaging as messagingType } from '.'
export const messaging: moo.core.context<messagingType> ={
  email
}
