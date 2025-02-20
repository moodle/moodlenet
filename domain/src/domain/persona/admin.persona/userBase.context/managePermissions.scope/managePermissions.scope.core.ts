import { edit } from './edit.usecase/edit.usecase.core'
import { searchUsers } from './searchUsers.usecase/searchUsers.usecase.core'
import type { managePermissions as managePermissionsType } from '.'
export const managePermissions: moo.core.scope<managePermissionsType> ={
  edit,
  searchUsers
}
