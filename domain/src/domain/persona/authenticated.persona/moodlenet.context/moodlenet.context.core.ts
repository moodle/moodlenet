import { contribute } from './contribute.scope/contribute.scope.core'
import { curateContent } from './curateContent.scope/curateContent.scope.core'
import { curatePreferences } from './curatePreferences.scope/curatePreferences.scope.core'
import { exchangeWithLms } from './exchangeWithLms.scope/exchangeWithLms.scope.core'
import type { moodlenet as moodlenet_def } from '.'
export const moodlenet: moo.core.context<moodlenet_def> = {
  contribute,
  curateContent,
  curatePreferences,
  exchangeWithLms,
}
