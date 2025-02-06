/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { email_address, signed_token } from '@moodle/lib-types'

export type emailSignup = moo.service<{
  model: moo.model<EmailSignupModel>
  tokens: {
    emailConfirmationToken: { passwordHash: string; displayName: string; email: email_address }
  }
}>

export type EmailSignupModel = {
  sendUserEmailConfirmation: moo.model.type.endpoint<
    [
      'async',
      {
        email: email_address
        displayName: string
        confirmationToken: signed_token
      },
      void,
    ]
  >
}
