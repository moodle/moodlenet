import { edit } from './edit.usecase/edit.usecase.core'
import { searchUsers } from './searchUsers.usecase/searchUsers.usecase.core'
import type { managePermissions as managePermissions_def } from '.'
export const managePermissions: moo.core.scope<managePermissions_def> = {
  edit,
  searchUsers,
}
