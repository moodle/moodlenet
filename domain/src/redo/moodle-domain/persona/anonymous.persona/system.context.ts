import * as moo from 'moodle-domain'
import { Signup } from './system.context/signup.scope'

export type System = moo.DefContext<{ signup: Signup }>
