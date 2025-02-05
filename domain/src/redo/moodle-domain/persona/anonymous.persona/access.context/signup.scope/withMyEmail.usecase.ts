import * as moo from 'moodle-domain'
import { confirmMyEmail, confirmMyEmail_Gate } from './withMyEmail.usecase/confirmMyEmail.endpoint'
import { submitSignupForm, submitSignupForm_Gate } from './withMyEmail.usecase/submitSignupForm.endpoint'
export type WithMyEmail = moo.DefUseCase<{
  submitSignupForm: submitSignupForm
  confirmMyEmail: confirmMyEmail
}>

export const WithMyEmail_Gate: moo.Gate_UseCase<WithMyEmail> = {
  confirmMyEmail: confirmMyEmail_Gate,
  submitSignupForm: submitSignupForm_Gate,
}
