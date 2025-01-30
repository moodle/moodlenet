import { map } from '@moodle/lib-types'
import * as moo from 'moodle-domain'
declare module 'moodle-domain' {
  interface Systems {
    emailSignup: EmailSignupSystem
  }
}
export type EmailSignupSystem = moo.DefSystem<{
  model: moo.DefModel<map>
}>
