import * as moo from 'moodle-domain'
import { EmailSignup } from './emailSignup/emailSignup'

export type anonymous = moo.DefPersona<{
  context: never
  services: moo.DefPersonaServices<{
    emailSignup: EmailSignup
  }>
}>
