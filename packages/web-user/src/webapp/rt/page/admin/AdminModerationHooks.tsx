import { href } from '@moodlenet/react-app/common'
import { silentCatchAbort } from '@moodlenet/react-app/webapp'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { AdminSearchUserSortType } from '../../../../common/expose-def.mjs'
import {
  UserStatusChangeRPC2UserStatusChange,
  userReportRPC2UserReport,
} from '../../../../common/rpcMappings.mjs'
import type { User, WebUserDataRPC } from '../../../../common/types.mjs'
import type { ModerationProps, ModerationUser, SortReportedUsers } from '../../../ui/exports/ui.mjs'
import { shell } from '../../shell.mjs'

export const useAdminModerationProps = (): ModerationProps => {
  const [sortType, setSortType] = useState<AdminSearchUserSortType | ''>('')
  const setSort = useCallback(
    (type: AdminSearchUserSortType) => {
      setSortType(type === sortType ? '' : type)
    },
    [sortType],
  )
  const sort = useMemo<SortReportedUsers>(() => {
    return {
      sortByDisplayName() {
        setSort('DisplayName')
      },
      sortByFlags() {
        setSort('Flags')
      },
      sortByLastFlag() {
        setSort('LastFlag')
      },
      sortByMainReason() {
        setSort('MainReason')
      },
      sortByStatus() {
        setSort('Status')
      },
    }
  }, [setSort])

  const [searchStr, setSearch] = useState<string>('')
  const [usersCache, setUsersCache] = useState<WebUserDataRPC[]>([])

  const searchUser = useCallback(() => {
    shell.rpc
      .me('webapp/admin/roles/searchUsers', { rpcId: 'webapp/admin/moderation/searchUsers' })({
        search: searchStr,
        sortType: sortType || 'LastFlag',
        filterNoFlag: true,
        forReports: true,
      })
      .then(setUsersCache)
      .catch(silentCatchAbort)
    // setSearch(str)
  }, [sortType, searchStr])

  useEffect(() => {
    searchUser()
  }, [searchUser])

  const userProps = useMemo<ModerationProps>(() => {
    const users = usersCache.map<ModerationUser>(
      ({
        reports,
        currentStatus,
        statusHistory,
        mainReportReason,
        isPublisher,
        _key: webUserKey,
        name: title,
        email,
        isAdmin,
        profileKey,
        profileHomePath,
      }) => {
        const deleteUser = async () => {
          return shell.rpc.me('webapp/admin/moderation/___delete-user/:webUserKey')(null, {
            webUserKey: webUserKey,
          })
          ///.then(() => searchUser(search))
        }
        const deleteReports = async () => {
          return shell.rpc.me('webapp/admin/moderation/ignore-user-reports/:webUserKey')(null, {
            webUserKey: webUserKey,
          })
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
      search: setSearch,
      sort,
      tableItems: [],
    }
    return moderationProps
  }, [setSearch, sort, usersCache])

  return userProps
}
