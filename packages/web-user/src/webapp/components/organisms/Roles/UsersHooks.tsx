import { UserTypeApiProps } from '@moodlenet/authentication-manager'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { MainContext } from '../../../MainContext.js'
import { UsersProps } from './Users.js'

export const useUsersProps = (): UsersProps => {
  const { use } = useContext(MainContext)
  const [search, setSearch] = useState<string>('')
  const [usersCache, setUsersCache] = useState<UserTypeApiProps[]>([])

  const searchUser = useCallback(
    (str: string) => {
      use.auth.rpc('getUsers')({ search: str }).then(setUsersCache)
      setSearch(str)
    },
    [use.auth],
  )

  useEffect(() => {
    searchUser('')
  }, [searchUser])

  const userProps = useMemo<UsersProps>(() => {
    const users: UsersProps['users'] = usersCache.map(({ userId, displayName, email, isAdmin }) => {
      const toggleIsAdmin = async () => {
        return use.auth.rpc.toggleIsAdmin({ userId }).then(() => searchUser(search))
      }
      return {
        user: { displayName, email, isAdmin },
        toggleIsAdmin,
      }
    })
    return {
      users,
      search: searchUser,
    }
  }, [search, searchUser, use.auth.rpc, usersCache])

  return userProps
}
