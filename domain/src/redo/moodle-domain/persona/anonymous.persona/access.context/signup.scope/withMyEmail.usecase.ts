import { email_address, signed_token } from '@moodle/lib-types'
import { confirmMyEmail, confirmMyEmail_Gate } from './withMyEmail.usecase/confirmMyEmail.endpoint'
import { submitSignupForm, submitSignupForm_Gate } from './withMyEmail.usecase/submitSignupForm.endpoint'
export type withMyEmail = moo.persona.usecase<{
  submitSignupForm: submitSignupForm
  confirmMyEmail: confirmMyEmail
  [moo.persona.usecase.services]: {
    signedTokens: {
      emailConfirmationToken: { passwordHash: string; displayName: string; email: email_address }
    }
    mailer: {
      userEmailConfirmation: {
        email: email_address
        displayName: string
        confirmationToken: signed_token
      }
    }
  }
}>

export const withMyEmailGate: moo.gate.usecase<withMyEmail> = {
  confirmMyEmail: confirmMyEmail_Gate,
  submitSignupForm: submitSignupForm_Gate,
}
