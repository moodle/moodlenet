import type { moodlenet as moodlenet_def } from './moodlenet.context'
import { viewPublicContent } from './viewPublicContent.scope/viewPublicContent.scope.core'
export const moodlenet: moo.def.core.context<moodlenet_def> = {
  viewPublicContent,
}
