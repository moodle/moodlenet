import type { signup as signup_def } from './signup.scope'
import { withMyEmail } from './withMyEmail.usecase/withMyEmail.usecase.core'
export const signup: moo.def.core.scope<signup_def> = {
  withMyEmail,
}
