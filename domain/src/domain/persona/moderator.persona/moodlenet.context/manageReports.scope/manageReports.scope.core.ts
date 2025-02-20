import { contributors } from './contributors.usecase/contributors.usecase.core'
import type { manageReports as manageReportsType } from '.'
export const manageReports: moo.core.scope<manageReportsType> ={
  contributors
}
