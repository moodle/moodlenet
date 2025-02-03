import { map } from '@moodle/lib-types'
import * as moo from 'moodle-domain'

export type moodlenet = moo.DefService<{
  model: moo.DefModel<map>
  tokens: never
}>
