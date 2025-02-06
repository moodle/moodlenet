import { confirmMyEmail, confirmMyEmail_Gate } from './withMyEmail.usecase/confirmMyEmail.endpoint'
import { submitSignupForm, submitSignupForm_Gate } from './withMyEmail.usecase/submitSignupForm.endpoint'
export type withMyEmail = moo.persona.usecase<{
  submitSignupForm: submitSignupForm
  confirmMyEmail: confirmMyEmail
}>

export const withMyEmailGate: moo.gate.usecase<withMyEmail> = {
  confirmMyEmail: confirmMyEmail_Gate,
  submitSignupForm: submitSignupForm_Gate,
}
