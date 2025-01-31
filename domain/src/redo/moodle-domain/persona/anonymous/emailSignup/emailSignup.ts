import * as moo from 'moodle-domain'
import { confirmMyEmail } from './signupWithMyEmail/confirmMyEmail'
import { submitSignup } from './signupWithMyEmail/submitSignup'

export type EmailSignup = moo.DefServiceAccess<{
  useCase: {
    signupWithMyEmail: {
      submitSignup: submitSignup
      confirmMyEmail: confirmMyEmail
    }
  }
}>
