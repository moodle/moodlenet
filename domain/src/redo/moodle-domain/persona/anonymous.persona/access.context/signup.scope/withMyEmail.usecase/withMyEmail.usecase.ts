import { email_address, signed_token } from '@moodle/lib-types'
import { confirmMyEmail, confirmMyEmail_Gate } from './confirmMyEmail.endpoint'
import { submitSignupForm, submitSignupForm_Gate } from './submitSignupForm.endpoint'
export type withMyEmail = moo.persona.usecase<{
  submitSignupForm: submitSignupForm
  confirmMyEmail: confirmMyEmail
  [moo.persona.usecase.modelTypes]: {
    jwtTokens: {
      emailConfirmationToken: { passwordHash: string; displayName: string; email: email_address }
    }
    mailer: {
      userEmailConfirmation: {
        displayName: string
        confirmationToken: signed_token
      }
    }
  }
}>

export const withMyEmail_Gate: moo.gate.usecase<withMyEmail> = {
  confirmMyEmail: confirmMyEmail_Gate,
  submitSignupForm: submitSignupForm_Gate,
}
