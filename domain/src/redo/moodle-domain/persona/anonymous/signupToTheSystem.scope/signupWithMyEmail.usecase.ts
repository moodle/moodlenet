import * as moo from 'moodle-domain'
import { confirmMyEmail } from './signupWithMyEmail.usecase/confirmMyEmail.endpoint'
import { submitSignup } from './signupWithMyEmail.usecase/submitSignup.endpoint'
export type SignupWithMyEmail = moo.DefUseCase<{
  endpoint: {
    submitSignup: submitSignup
    confirmMyEmail: confirmMyEmail
  }
  directives: null
}>
