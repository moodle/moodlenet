'use server'

import { userId, userRole } from '@moodle/module/user-account'
import { primary } from '../../../../lib/server/session-access'
import { UserRow } from './users.client'

export async function searchUsers({ textSearch }: { textSearch: string }) {
  const { users } = await primary.moodle.userAccount.admin.searchUsers({ textSearch })
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
export async function editUserRole({ userId, action, role }: { userId: userId; role: userRole; action: 'set' | 'unset' }) {
  const [done, result] = await primary.moodle.userAccount.admin.editUserRoles({ userId, role, action })
  return done ? result.updatedRoles : []
}
