import type { withMyEmail as withMyEmailType } from '.'
import { confirmMyEmail } from './confirmMyEmail.core'
import { submitSignupForm } from './submitSignupForm.core'
export const withMyEmail: moo.core.usecase<withMyEmailType> = {
  confirmMyEmail,
  submitSignupForm,
}
