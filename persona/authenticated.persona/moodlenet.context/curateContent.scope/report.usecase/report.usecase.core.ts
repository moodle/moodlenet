import type { report as reportType } from '.'
import { contributor } from './contributor.core'
export const report: moo.core.usecase<reportType> = {
  contributor,
}
