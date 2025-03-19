import type { contributors as contributorsType } from '.'
import { ignoreReports } from './ignoreReports.core'
import { viewList } from './viewList.core'
export const contributors: moo.core.usecase<contributorsType> = {
  ignoreReports,
  viewList,
}
