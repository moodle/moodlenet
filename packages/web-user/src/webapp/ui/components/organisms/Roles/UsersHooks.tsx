import { useCallback, useEffect, useMemo, useState } from 'react'
import type { User, WebUserData } from '../../../../../common/types.mjs'
import { shell } from '../../../../shell.mjs'
import type { UsersProps } from './Users.js'

export const useUsersProps = (): UsersProps => {
  const [search, setSearch] = useState<string>('')
  const [usersCache, setUsersCache] = useState<WebUserData[]>([])

  const searchUser = useCallback((str: string) => {
    shell.rpc.me['webapp/roles/searchUsers']({ search: str }).then(setUsersCache)
    setSearch(str)
  }, [])

  useEffect(() => {
    searchUser('')
  }, [searchUser])

  const userProps = useMemo<UsersProps>(() => {
    const users: UsersProps['users'] = usersCache.map(({ _key, name: title, email, isAdmin }) => {
      const toggleIsAdmin = async () => {
        return shell.rpc.me['webapp/roles/toggleIsAdmin']({ userKey: _key }).then(() =>
          searchUser(search),
        )
      }
      const user: User = { title, email, isAdmin }
      return {
        user,
        toggleIsAdmin,
      }
    })
    return {
      users,
      search: searchUser,
    }
  }, [search, searchUser, usersCache])

  return userProps
}
