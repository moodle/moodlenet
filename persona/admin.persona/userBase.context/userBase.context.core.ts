import { managePermissions } from './managePermissions.scope/managePermissions.scope.core'
import type { userBase as userBase_def } from '.'
export const userBase: moo.core.context<userBase_def> = {
  managePermissions,
}
