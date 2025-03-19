import { confirmMyEmail } from './confirmMyEmail.core'
import { submitSignupForm } from './submitSignupForm.core'
import type { withMyEmail as withMyEmail_def } from './withMyEmail.usecase'
export const withMyEmail: moo.def.core.usecase<withMyEmail_def> = {
  confirmMyEmail,
  submitSignupForm,
}
