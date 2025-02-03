import { typ } from '@moodle/lib-types'
import * as moo from 'moodle-domain'
import { SignupWithMyEmail } from './signupToTheSystem.scope/signupWithMyEmail.usecase'

export type SignupToTheSystem = moo.DefScope<{
  useCase: typ<SignupToTheSystemUseCases>
  directives: null
}>

export interface SignupToTheSystemUseCases {
  signupWithMyEmail: SignupWithMyEmail
}
