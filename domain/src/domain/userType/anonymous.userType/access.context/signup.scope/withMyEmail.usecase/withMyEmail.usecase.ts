import { confirmMyEmail } from './confirmMyEmail.endpoint'
import { submitSignupForm } from './submitSignupForm.endpoint'

export interface WithMyEmail {
  submitSignupForm: submitSignupForm
  confirmMyEmail: confirmMyEmail
}

export type withMyEmail = moo.def.userType.usecase<moo<WithMyEmail>>

export const withMyEmail: moo.def.gate.provider.usecase<withMyEmail> = {
  confirmMyEmail,
  submitSignupForm,
}
