import { moodlenet } from './moodlenet.context/moodlenet.context.core'
import type { moderator as moderator_def } from '.'
export const moderator: moo.core.persona<moderator_def> = {
  moodlenet,
}
