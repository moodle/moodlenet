import { UserTypeApiProps } from '@moodlenet/authentication-manager'
import { useEffect } from '@storybook/addons'
import { useCallback, useContext, useMemo, useState } from 'react'
import { MainContext } from '../../../../../context/MainContext.mjs'
// import { TUserProps, TUsersProps } from '../../../../../web-lib.mjs'

export type UserTypeProps = {
  key: string
  displayName: string
  email: string
  userTypes: string[]
}

export type UserTypeListProps = {
  users: UserTypeProps[]
  changeType: (key: string, userType: string) => void
}

export const useUsersProps = (): UserTypeListProps => {
  const { use } = useContext(MainContext)
  const [users, setUsers] = useState<UserTypeProps[]>([])
  const [search, setSearch] = useState<string>('')

  const mapKey = (el: UserTypeApiProps): UserTypeProps => {
    const { userId, ...aUser } = el
    return { ...aUser, key: userId }
  }

  const getUsers = useCallback(
    (_search: string) => {
      setSearch(_search)
      use.auth
        .rpc('getUsers')({ search })
        .then(list => setUsers(list.map(mapKey)))
    },
    [search, use.auth],
  )

  useEffect(() => {
    getUsers(search)
  }, [getUsers, search])

  const usersProps = useMemo<UserTypeListProps>(() => {
    const _change = async (key: string, userType: string) => {
      use.auth.rpc.changeUserType({ key, userType }).then(() => getUsers(search))
    }

    return { users, changeType: _change }
  }, [getUsers, search, use.auth.rpc, users])

  return usersProps
}
