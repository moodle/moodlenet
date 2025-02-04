import * as moo from 'moodle-domain'
import { confirmMyEmail } from './withMyEmail.usecase/confirmMyEmail.endpoint'
import { submitSignup } from './withMyEmail.usecase/submitSignup.endpoint'
export type WithMyEmail = moo.DefUseCase<{
  submitSignup: submitSignup
  confirmMyEmail: confirmMyEmail
}>
