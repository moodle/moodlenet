import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { User, WebUserData } from '../../../../../common/types.mjs'
import { MainContext } from '../../../../context/MainContext.mjs'
import type { UsersProps } from './Users.js'

export const useUsersProps = (): UsersProps => {
  const { use } = useContext(MainContext)
  const [search, setSearch] = useState<string>('')
  const [usersCache, setUsersCache] = useState<WebUserData[]>([])

  const searchUser = useCallback(
    (str: string) => {
      use.me.rpc['webapp/roles/searchUsers']({ search: str }).then(setUsersCache)
      setSearch(str)
    },
    [use.me],
  )

  useEffect(() => {
    searchUser('')
  }, [searchUser])

  const userProps = useMemo<UsersProps>(() => {
    const users: UsersProps['users'] = usersCache.map(({ _key, name: title, email, isAdmin }) => {
      const toggleIsAdmin = async () => {
        return use.me.rpc['webapp/roles/toggleIsAdmin']({ userKey: _key }).then(() =>
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
  }, [search, searchUser, use.me.rpc, usersCache])

  return userProps
}
