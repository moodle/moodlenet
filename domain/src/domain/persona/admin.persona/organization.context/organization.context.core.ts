import { curateInfo } from './curateInfo.scope/curateInfo.scope.core'
import type { organization as organization_def } from '.'
export const organization: moo.core.context<organization_def> = {
  curateInfo,
}
