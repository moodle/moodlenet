import * as moo from 'moodle-domain'
import { WithMyEmail } from './signup.scope/withMyEmail.usecase'

export type Signup = moo.DefScope<{ withMyEmail: WithMyEmail }>
