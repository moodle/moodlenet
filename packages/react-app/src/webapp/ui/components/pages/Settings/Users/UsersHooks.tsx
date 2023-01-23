import { UserTypeApiProps } from '@moodlenet/authentication-manager'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { UsersProps } from '@moodlenet/react-app/ui'
import { MainContext } from '../../../../../context/MainContext.mjs'

export const useUsersProps = (): UsersProps => {
  const { use } = useContext(MainContext)
  const [search, setSearch] = useState<string>('')
  const [usersCache, setUsersCache] = useState<UserTypeApiProps[]>([])

  const getUsers = useCallback(
    (_search: string) => {
      setSearch(_search)
      use.auth.rpc('getUsers')({ search }).then(setUsersCache)
    },
    [search, use.auth],
  )

  useEffect(() => {
    getUsers(search)
  }, [getUsers, search])

  const userProps = useMemo<UsersProps>(() => {
    const users: UsersProps['users'] = usersCache.map(({ userId, displayName, email, isAdmin }) => {
      const toggleIsAdmin = async () => {
        use.auth.rpc.toggleIsAdmin({ userId }).then(() => getUsers(search))
      }
      return {
        user: { displayName, email, isAdmin },
        toggleIsAdmin,
      }
    })
    return {
      users,
    }
  }, [getUsers, search, use.auth.rpc, usersCache])

  return userProps
}
