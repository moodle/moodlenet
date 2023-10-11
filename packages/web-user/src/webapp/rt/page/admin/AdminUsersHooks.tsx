import { href } from '@moodlenet/react-app/common'
import { silentCatchAbort } from '@moodlenet/react-app/webapp'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { User, WebUserData } from '../../../../common/types.mjs'
import type { UsersProps } from '../../../ui/components/organisms/Roles/Users.js'
import { shell } from '../../shell.mjs'

export const useAdminUsersProps = (): UsersProps => {
  const [search, setSearch] = useState<string>('')
  const [usersCache, setUsersCache] = useState<WebUserData[]>([])

  const searchUser = useCallback((str: string) => {
    shell.rpc
      .me('webapp/admin/roles/searchUsers', { rpcId: 'webapp/admin/roles/searchUsers' })({
        search: str,
      })
      .then(setUsersCache)
      .catch(silentCatchAbort)
    setSearch(str)
  }, [])

  useEffect(() => {
    searchUser('')
  }, [searchUser])

  const userProps = useMemo<UsersProps>(() => {
    const users: UsersProps['users'] = usersCache.map(
      ({ isPublisher, _key, name: title, email, isAdmin, profileKey, profileHomePath }) => {
        const toggleIsAdmin = async () => {
          return shell.rpc
            .me('webapp/admin/roles/toggleIsAdmin')({ userKey: _key })
            .then(() => searchUser(search))
        }
        const toggleIsPublisher = async () => {
          return shell.rpc
            .me('webapp/admin/roles/toggleIsPublisher')({ profileKey })
            .then(() => searchUser(search))
        }
        const user: User = {
          title,
          email,
          isAdmin,
          isPublisher,
          profileHref: href(profileHomePath),
        }
        return {
          user,
          toggleIsAdmin,
          toggleIsPublisher,
        }
      },
    )
    return { tableItems: [], users, search: searchUser }
  }, [search, searchUser, usersCache])

  return userProps
}
