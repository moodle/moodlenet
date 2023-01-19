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

  const getUsers = useCallback(() => {
    use.auth
      .rpc('getUsers')({ search: '' })
      .then(list => {
        const users = list.map(el => {
          const { userId, ...aUser } = el
          return { ...aUser, key: userId }
        })
        setUsers(users)
      })
  }, [use.auth])

  useEffect(() => {
    getUsers()
  }, [getUsers])

  const usersProps = useMemo<UserTypeListProps>(() => {
    const _change = async (key: string, userType: string) => {
      use.auth.rpc.changeUserType({ key, userType })
    }

    const userProps: UserTypeListProps = {
      users,
      changeType: _change,
    }
    return userProps
  }, [use.auth.rpc, users])

  return usersProps
}
