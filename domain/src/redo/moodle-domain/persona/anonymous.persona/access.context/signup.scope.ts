import * as moo from 'moodle-domain'
import { WithMyEmail, WithMyEmail_Gate } from './signup.scope/withMyEmail.usecase'

export type Signup = moo.DefScope<{ withMyEmail: WithMyEmail }>

export const Signup_Gate: moo.Gate_Scope<Signup> = {
  withMyEmail: WithMyEmail_Gate,
}
