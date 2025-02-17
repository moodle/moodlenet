import { email_address, signed_token } from '@moodle/lib-types'
import { confirmMyEmail } from './confirmMyEmail.endpoint'
import { submitSignupForm } from './submitSignupForm.endpoint'
declare module '..' {
  interface Scope {
    withMyEmail: withMyEmail
  }
}

export type withMyEmail = moo.persona.usecase<
  {
    submitSignupForm: submitSignupForm
    confirmMyEmail: confirmMyEmail
  },
  {
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
>

export const withMyEmail: moo.gate.provider.usecase<withMyEmail> = {
  confirmMyEmail,
  submitSignupForm,
}
