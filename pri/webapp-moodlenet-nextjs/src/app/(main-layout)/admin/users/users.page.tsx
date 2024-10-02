import { UsersClient } from './users.client'
import { editUserRole, searchUsers } from './users.server'

export default async function UsersPage({
  searchParams,
}: {
  searchParams?: { textSearch?: string }
}) {
  const users = await searchUsers({ textSearch: searchParams?.textSearch ?? '' })
  return <UsersClient editUserRole={editUserRole} users={users} />
}
