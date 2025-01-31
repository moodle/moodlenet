import { map } from '@moodle/lib-types'
import * as moo from 'moodle-domain'

export type emailSignup = moo.DefService<{
  model: moo.DefModel<map>
}>
