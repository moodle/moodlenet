import * as moo from 'moodle-domain'
import { confirmMyEmail, confirmMyEmail_Gate } from './withMyEmail.usecase/confirmMyEmail.endpoint'
import { submitSignup, submitSignup_Gate } from './withMyEmail.usecase/submitSignup.endpoint'
export type WithMyEmail = moo.DefUseCase<{
  submitSignup: submitSignup
  confirmMyEmail: confirmMyEmail
}>

export const WithMyEmail_Gate: moo.Gate_UseCase<WithMyEmail> = {
  confirmMyEmail: confirmMyEmail_Gate,
  submitSignup: submitSignup_Gate,
}
