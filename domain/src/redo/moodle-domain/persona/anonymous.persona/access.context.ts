import * as moo from 'moodle-domain'
import { Signup, Signup_Gate } from './access.context/signup.scope'

export type Access = moo.DefContext<{ signup: Signup }>

export const Access_Gate: moo.Gate_Context<Access> = {
  signup: Signup_Gate,
}
