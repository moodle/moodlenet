import { manageReports } from './manageReports.scope/manageReports.scope.core'
import type { moodlenet as moodlenet_def } from '.'
export const moodlenet: moo.core.context<moodlenet_def> = {
  manageReports,
}
