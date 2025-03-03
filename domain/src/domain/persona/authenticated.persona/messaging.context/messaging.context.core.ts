import { email } from './email.scope/email.scope.core'
import type { messaging as messaging_def } from '.'
export const messaging: moo.core.context<messaging_def> = {
  email,
}
