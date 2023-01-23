import { UserTypeApiProps } from '@moodlenet/authentication-manager'
import { useEffect } from '@storybook/addons'
import { useCallback, useContext, useMemo, useState } from 'react'
import { Link, UserTypeListProps, UserTypeProps } from '@moodlenet/react-app/ui'
import { MainContext } from '../../../../../context/MainContext.mjs'
import { ReactAppContext, SettingsSectionItem } from '../../../../../web-lib.mjs'


/* export type UserTypeProps = {
  key: string
  displayName: string
  email: string
  userTypes: string[]
}

export type UserTypeListProps = {
  users: UserTypeProps[]
  changeType: (key: string, userType: string) => void
}*/

const MyPageLink = () => {
  return <Link href={{ ext: true, url: '/test' }}>my page</Link>
}
const myRightComponent = { Component: MyPageLink }
const myPageMenuItem = {
  Text: 'My page',
  Icon: null,
  Path: { ext: true, url: '/my-moodlenet-mjs-pkg-template' },
}

export const useUsersProps = (): UserTypeListProps => {
  const { registries } = useContext(ReactAppContext)
  registries.rightComponents.useRegister(myRightComponent)
  registries.avatarMenuItems.useRegister(myPageMenuItem)
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

    return { users, toggleUserType: _change }
  }, [getUsers, search, use.auth.rpc, users])

  return usersProps
}
