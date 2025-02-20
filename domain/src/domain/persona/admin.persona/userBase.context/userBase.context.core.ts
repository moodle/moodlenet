import { managePermissions } from './managePermissions.scope/managePermissions.scope.core'
import type { userBase as userBaseType } from '.'
export const userBase: moo.core.context<userBaseType> ={
  managePermissions
}
