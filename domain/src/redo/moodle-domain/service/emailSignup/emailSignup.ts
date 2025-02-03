/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { email_address, signed_token } from '@moodle/lib-types'
import * as moo from 'moodle-domain'

export type emailSignup = moo.DefService<{
  model: moo.DefModel<EmailSignupModel>
}>

export interface EmailSignupModel {
  sendUserEmailConfirmation: moo.Endpoint<
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
