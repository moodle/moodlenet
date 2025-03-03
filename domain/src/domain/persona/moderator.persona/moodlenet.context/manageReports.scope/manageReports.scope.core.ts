import { contributors } from './contributors.usecase/contributors.usecase.core'
import type { manageReports as manageReports_def } from '.'
export const manageReports: moo.core.scope<manageReports_def> = {
  contributors,
}
