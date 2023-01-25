import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { UserTypeApiProps } from '../../../../common/types.mjs'
import { MainContext } from '../../../MainContext.js'
import { UsersProps } from './Users.js'

export const useUsersProps = (): UsersProps => {
  const { use } = useContext(MainContext)
  const [search, setSearch] = useState<string>('')
  const [usersCache, setUsersCache] = useState<UserTypeApiProps[]>([])

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
    const users: UsersProps['users'] = usersCache.map(({ userId, title, email, isAdmin }) => {
      const toggleIsAdmin = async () => {
        return use.me.rpc['webapp/roles/toggleIsAdmin']({ userId }).then(() => searchUser(search))
      }
      return {
        user: { title, email, isAdmin },
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
