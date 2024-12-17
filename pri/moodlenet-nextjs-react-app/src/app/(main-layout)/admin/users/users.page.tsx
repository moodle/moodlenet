import { pageProps, paramOpt } from '../../../../lib/server/page-props'
import { UsersClient } from './users.client'
import { searchUsers } from './users.server'

export default async function UsersPage({ searchParams }: pageProps<never, { textSearch?: string }>) {
  const textSearch = (await paramOpt('textSearch', searchParams)) ?? ''
  const users = await searchUsers({ textSearch })
  return <UsersClient users={users} />
}
