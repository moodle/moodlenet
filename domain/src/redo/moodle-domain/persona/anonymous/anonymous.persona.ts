import * as moo from 'moodle-domain'
import { SignupToTheSystem } from './signupToTheSystem.scope'

export type anonymous = moo.DefPersona<{
  scope: moo.DefPersonaScopes<{
    signupToTheSystem: SignupToTheSystem
  }>
  directives: null
}>
