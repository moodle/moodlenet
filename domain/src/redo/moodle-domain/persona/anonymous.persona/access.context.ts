import * as moo from 'moodle-domain'
import { Signup } from './access.context/signup.scope'

export type Access = moo.DefContext<{ signup: Signup }>
