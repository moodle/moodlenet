import type { FC } from 'react'
import { Users } from './Users.js'
import { useUsersProps } from './UsersHooks.js'

export const UsersContainer: FC = () => {
  const UsersProps = useUsersProps()
  return <Users {...UsersProps} />
}

export const UsersMenu: FC = () => <span>Users</span>
