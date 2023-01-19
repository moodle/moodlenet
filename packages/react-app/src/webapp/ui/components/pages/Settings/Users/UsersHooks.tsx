import { useEffect } from '@storybook/addons'
import { useContext, useMemo, useState } from 'react'
import { MainContext } from '../../../../../context/MainContext.mjs'
import { TUserProps, TUsersProps } from '../../../../../web-lib.mjs'

export const useUsersProps = (): TUserProps => {
  const { use } = useContext(MainContext)
  const [users, setUsers] = useState<TUsersProps[]>([])


  useEffect(() => {
    const users = use.auth
      .rpc('getUsers')({ search: '' })
      .then(res => {
        setUsers(res)
      })
  }, [use.auth])

  const getUsers = useMemo<TUsersProps>(() => {
    use.auth.rpc('getUsers')(req:{ search: '' })
      .then(res => {
        setUsers(res)
      })
  })

  const usersProps = useMemo<TUsersProps>(() => {
    const _change = async (key: string, userType: string) => {
     use.auth.rpc('changeUserType')({ key, userType })
    }
    return {
      users,
      changeType:
    }
  }, [_change, users])

  return {
    users,
  }
}
