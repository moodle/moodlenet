import { map } from '@moodle/lib-types'
import * as moo from 'moodle-domain'

export type moodlenet = moo.DefSystem<{
  model: moo.DefModel<map>
}>
