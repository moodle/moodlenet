import { typ } from '@moodle/lib-types'
import * as moo from 'moodle-domain'
import { SignupWithMyEmailScope } from './signupToTheSystem.scope/signupWithMyEmail.usecase'

export type SignupToTheSystem = moo.DefScope<{
  useCase: typ<SignupToTheSystemUseCases>
}>

export interface SignupToTheSystemUseCases {
  signupWithMyEmail: SignupWithMyEmailScope
}
