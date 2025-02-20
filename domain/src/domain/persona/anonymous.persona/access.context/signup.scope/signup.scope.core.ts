import { withMyEmail } from './withMyEmail.usecase/withMyEmail.usecase.core'
import type { signup as signupType } from '.'
export const signup: moo.core.scope<signupType> ={
  withMyEmail
}
