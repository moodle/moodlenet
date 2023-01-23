import { UserTypeApiProps } from '@moodlenet/authentication-manager'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { UsersProps } from '@moodlenet/react-app/ui'
import { MainContext } from '../../../../../context/MainContext.mjs'

export const useUsersProps = (): UsersProps => {
  const { use } = useContext(MainContext)
  const [search, setSearch] = useState<string>('')
  const [usersCache, setUsersCache] = useState<UserTypeApiProps[]>([])

  // const searchUser = useCallback((_search: string) => {
  //   setSearch(_search)
  // }, [])

  const load = useCallback(() => {
    use.auth.rpc('getUsers')({ search }).then(setUsersCache)
  }, [search, use.auth])

  useEffect(() => {
    use.auth.rpc('getUsers')({ search: '' }).then(setUsersCache)
  }, [use.auth])

  const userProps = useMemo<UsersProps>(() => {
    const users: UsersProps['users'] = usersCache.map(({ userId, displayName, email, isAdmin }) => {
      const toggleIsAdmin = async () => {
        use.auth.rpc.toggleIsAdmin({ userId }).then(() => load())
      }
      return {
        user: { displayName, email, isAdmin },
        toggleIsAdmin,
      }
    })
    return {
      users,
    }
  }, [load, use.auth.rpc, usersCache])

  return userProps
}
