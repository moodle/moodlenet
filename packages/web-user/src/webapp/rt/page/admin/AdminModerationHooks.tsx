import { href } from '@moodlenet/react-app/common'
import { silentCatchAbort } from '@moodlenet/react-app/webapp'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { AdminSearchUserSortType } from '../../../../common/expose-def.mjs'
import {
  UserStatusChangeRPC2UserStatusChange,
  userReportRPC2UserReport,
} from '../../../../common/reports/rpcMappings.mjs'
import type { User, WebUserDataRPC } from '../../../../common/types.mjs'
import type { ModerationProps, ModerationUser, SortReportedUsers } from '../../../ui/exports/ui.mjs'
import { shell } from '../../shell.mjs'

export const useAdminModerationProps = (): ModerationProps => {
  const [sortType, setSortType] = useState<AdminSearchUserSortType>('LastFlag')
  const sort = useMemo<SortReportedUsers>(() => {
    return {
      sortByDispalyName() {
        setSortType('DispalyName')
      },
      sortByFlags() {
        setSortType('Flags')
      },
      sortByLastFlag() {
        setSortType('LastFlag')
      },
      sortByMainReason() {
        setSortType('MainReason')
      },
      sortByStatus() {
        setSortType('Status')
      },
    }
  }, [])

  // const [search, setSearch] = useState<string>('')
  const [usersCache, setUsersCache] = useState<WebUserDataRPC[]>([])

  const searchUser = useCallback(
    (str: string) => {
      shell.rpc
        .me('webapp/admin/roles/searchUsers', { rpcId: 'webapp/admin/roles/searchUsers' })({
          search: str,
          sortType: sortType,
        })
        .then(setUsersCache)
        .catch(silentCatchAbort)
      // setSearch(str)
    },
    [sortType],
  )

  useEffect(() => {
    searchUser('')
  }, [searchUser])

  const userProps = useMemo<ModerationProps>(() => {
    const users = usersCache.map<ModerationUser>(
      ({
        reports,
        currentStatus,
        statusHistory,
        mainReportReason,
        isPublisher,
        _key,
        name: title,
        email,
        isAdmin,
        profileKey,
        profileHomePath,
      }) => {
        const deleteUser = async () => {
          return shell.rpc.me('webapp/admin/moderation/___delete-user/:_key')(null, { _key })
          ///.then(() => searchUser(search))
        }
        const deleteReports = async () => {
          return shell.rpc.me('webapp/admin/moderation/delete-user-reports/:_key')(null, { _key })
          //  .then(() => searchUser(search))
        }
        const toggleIsPublisher = async () => {
          return shell.rpc.me('webapp/admin/roles/setIsPublisher')({
            profileKey,
            isPublisher: !isPublisher,
          })
          //    .then(() => searchUser(search))
        }
        const user: User = {
          currentStatus,
          statusHistory: statusHistory.map(UserStatusChangeRPC2UserStatusChange),
          mainReportReason,
          title,
          email,
          isAdmin,
          isPublisher,
          profileHref: href(profileHomePath),
          reports: reports.map(userReportRPC2UserReport),
        }
        const moderationUser: ModerationUser = {
          user,
          toggleIsPublisher,
          deleteReports,
          deleteUser,
        }
        return moderationUser
      },
    )
    const moderationProps: ModerationProps = {
      users,
      search: searchUser,
      sort,
      tableItems: [],
    }
    return moderationProps
  }, [searchUser, sort, usersCache])

  return userProps
}
