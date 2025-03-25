import { confirmMyEmail } from './confirmMyEmail.endpoint'
import { submitSignupForm } from './submitSignupForm.endpoint'
declare module '..' {
  interface Scope {
    withMyEmail: withMyEmail
  }
}

export type withMyEmail = moo.persona.usecase<{
  submitSignupForm: submitSignupForm
  confirmMyEmail: confirmMyEmail
}>

export const withMyEmail: moo.gate.provider.usecase<withMyEmail> = {
  confirmMyEmail,
  submitSignupForm,
}
