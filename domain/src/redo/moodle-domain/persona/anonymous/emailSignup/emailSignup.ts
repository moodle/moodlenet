import * as moo from 'moodle-domain'
import { confirmMyEmail } from './signupWithMyEmail/confirmMyEmail'
import { submitSignup } from './signupWithMyEmail/submitSignup'

export type EmailSignup = moo.DefSystemAccess<{
  useCase: {
    signupWithMyEmail: {
      submitSignup: submitSignup
      confirmMyEmail: confirmMyEmail
    }
  }
}>
