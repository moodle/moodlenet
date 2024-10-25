'use server'

import { userAccountId, userRole } from '@moodle/module/user-account'
import { access } from '../../../../lib/server/session-access'
import { UserRow } from './users.client'

export async function searchUsers({ textSearch }: { textSearch: string }) {
  const { users } = await access.primary.userAccount.admin.searchUsers({ textSearch })
  const userRows = users.map<UserRow>(user => {
    return {
      id: user.id,
      displayName: user.displayName,
      contacts: user.contacts,
      roles: user.roles,
    }
  })
  return userRows
}
export async function editUserRole({
  userAccountId,
  action,
  role,
}: {
  userAccountId: userAccountId
  role: userRole
  action: 'set' | 'unset'
}) {
  const [done, result] = await access.primary.userAccount.admin.editUserRoles({ userAccountId, role, action })
  return done ? result.updatedRoles : []
}
