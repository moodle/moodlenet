import type { FC } from 'react'
import { Users } from '../../../ui/exports/ui.mjs'
import { useAdminUsersProps } from './AdminUsersHooks'

export const AdminUsersContainer: FC = () => {
  const UsersProps = useAdminUsersProps()
  return <Users {...UsersProps} />
}

export const AdminUsersMenu: FC = () => <span>Users</span>
