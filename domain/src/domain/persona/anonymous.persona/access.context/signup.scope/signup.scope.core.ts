import { withMyEmail } from './withMyEmail.usecase/withMyEmail.usecase.core'
import type { signup as signup_def } from '.'
export const signup: moo.core.scope<signup_def> = {
  withMyEmail,
}
