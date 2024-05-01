import type { AddonItem } from '@moodlenet/component-library'
import {
  Card,
  Modal,
  PrimaryButton,
  Searchbox,
  Snackbar,
  SnackbarStack,
} from '@moodlenet/component-library'
import { Link } from '@moodlenet/react-app/ui'
import {
  CheckCircleOutline,
  HowToRegOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  ManageAccountsOutlined,
  PersonOffOutlined,
  PersonOutlineOutlined,
  Unpublished,
} from '@mui/icons-material'
import { useEffect, useMemo, useState, type FC } from 'react'
import type {
  ModerationResource,
  ReportProfileReasonName,
  User,
  UserReport,
  UserReporter,
  UserStatus,
} from '../../../../../common/types.mjs'
import { ReactComponent as RemoveFlag } from '../../../assets/icons/remove-flag.svg'
import WhistleblownResourcesModal from '../../molecules/WhistleblownResourcesModal/WhistleblownResourcesModal.js'
import './Moderation.scss'

export type ReportTableItem = {
  head: AddonItem
  body: { email: string; element: AddonItem }
}

export type ModerationUser = {
  user: User
  deleteUser(): unknown
  deleteReports(): unknown
  toggleIsPublisher(): unknown
}

export type SortReportedUsers = {
  sortByDisplayName(): unknown
  sortByFlags(): unknown
  sortByLastFlag(): unknown
  sortByMainReason(): unknown
  sortByStatus(): unknown
}

export type ModerationProps = {
  users: ModerationUser[]
  resources: ModerationResource[]
  search(str: string): unknown
  sort: SortReportedUsers
  tableItems: (ReportTableItem | null)[]
}

export const ModerationMenu = () => <abbr title="Moderation">Moderation</abbr>

const UserRow: FC<{
  id: number
  moderationUser: ModerationUser
  bodyItems: (AddonItem | null)[]
  toggleShowUserFlagsModal: React.Dispatch<React.SetStateAction<number | undefined>>
  setShowReasonsModal: React.Dispatch<React.SetStateAction<number | undefined>>
  setShowStatusModal: React.Dispatch<React.SetStateAction<number | undefined>>
  setIsToDelete: React.Dispatch<React.SetStateAction<number | undefined>>
  setShowDeleteReportsSnackbar: React.Dispatch<React.SetStateAction<string | undefined>>
  setDisplayNameToDelete: React.Dispatch<React.SetStateAction<string>>
}> = ({
  id,
  moderationUser,
  toggleShowUserFlagsModal,
  setShowReasonsModal,
  setShowStatusModal,
  setIsToDelete,
  setShowDeleteReportsSnackbar,
  setDisplayNameToDelete,
  //bodyItems,
}) => {
  const { user, toggleIsPublisher, deleteReports } = moderationUser
  const { mainReportReason, currentStatus, statusHistory } = user

  const statusIcons = {
    'Admin': { icon: <ManageAccountsOutlined />, title: 'Admin\nShow status changes' },
    'Publisher': { icon: <HowToRegOutlined />, title: 'Publisher\nShow status changes' },
    'Non-publisher': {
      icon: <PersonOutlineOutlined />,
      title: 'Non publisher\nShow status changes',
    },
    'Deleted': { icon: <PersonOffOutlined />, title: 'Deleted' },
  }

  const statusInfo = statusIcons[currentStatus as keyof typeof statusIcons]

  const accountStatus = statusInfo && (
    <abbr title={statusInfo.title} key={currentStatus} onClick={() => setShowStatusModal(id)}>
      {statusInfo.icon}
    </abbr>
  )

  const lastReport =
    user.reports.length > 0
      ? user.reports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
      : null
  const lastReportDateRaw = lastReport ? new Date(lastReport.date) : null
  const lastReportDate = lastReportDateRaw
    ? lastReportDateRaw
        .toLocaleString('default', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
        .replace(',', '')
    : ''
  const lastReportTime = lastReportDateRaw
    ? lastReportDateRaw.toLocaleString('default', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    : ''

  return (
    <div className="table-row">
      <abbr
        className={`display-name ${currentStatus === 'Deleted' ? 'deleted' : ''}`}
        title={
          currentStatus === 'Deleted'
            ? 'Deleted user, anonymous'
            : `Go to profile page\n${user.email}`
        }
      >
        {currentStatus !== 'Deleted' ? (
          <Link href={user.profileHref} target="_blank">
            {user.title}
          </Link>
        ) : (
          `Deleted - ${
            statusHistory[0]?.date
              ? new Date(statusHistory[0].date)
                  .toLocaleString('default', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                  .replace(',', '')
              : ''
          }`
        )}
      </abbr>
      <abbr
        className="flags"
        title="Show flag details"
        onClick={() => {
          toggleShowUserFlagsModal(id)
        }}
      >
        {user.reports.length}
      </abbr>
      <abbr className="last-flag" title={`${lastReportDate}, ${lastReportTime}`}>
        {lastReportDate}
      </abbr>
      <abbr
        className="reason"
        title="Show reason details"
        onClick={() => {
          setShowReasonsModal(id)
        }}
      >
        {mainReportReason}
      </abbr>
      <div className="status">{accountStatus}</div>
      <div className="actions">
        <abbr
          onClick={() => {
            if (currentStatus !== 'Deleted') {
              deleteReports()
              setShowDeleteReportsSnackbar(user.title)
            }
          }}
          className={`remove-flags ${currentStatus === 'Deleted' ? 'disabled' : ''}`}
          title={currentStatus === 'Deleted' ? 'Cannot remove flags from a deleted user' : 'Remove'}
        >
          <RemoveFlag />
        </abbr>
        <abbr
          onClick={() => toggleIsPublisher()}
          className={`unapprove ${
            (['Non-authenticated', 'Admin', 'Deleted'] as UserStatus[]).includes(currentStatus)
              ? 'disabled'
              : ''
          }`}
          title={
            currentStatus === 'Admin'
              ? 'Cannot unapprove an admin'
              : currentStatus === 'Publisher'
              ? 'Unapprove user'
              : currentStatus === 'Deleted'
              ? 'Cannot unapprove a deleted user'
              : currentStatus === 'Non-publisher'
              ? 'Approve user'
              : currentStatus === 'Non-authenticated'
              ? 'Cannot unapprove a non-authenticated user'
              : undefined
          }
        >
          {currentStatus === 'Non-publisher' ? <CheckCircleOutline /> : <Unpublished />}
        </abbr>
        <abbr
          onClick={() => {
            if (currentStatus !== 'Admin') {
              setIsToDelete(id)
              setDisplayNameToDelete(user.title)
            }
          }}
          className={`delete ${
            currentStatus === 'Admin' || currentStatus === 'Deleted' ? 'disabled' : ''
          }`}
          title={currentStatus === 'Admin' ? 'Cannot delete an admin' : 'Delete user'}
        >
          <PersonOffOutlined />
        </abbr>
      </div>
      {/* {bodyItems.map((item, i) => {
        return (
          <div key={(item && item.key) ?? i} id={item ? item.key.toString() : ''}>
            {item && item.Item ? <item.Item key={item.key} /> : null}
          </div>
        )
      })} */}
    </div>
  )
}

const ResourceRow: FC<{
  id: number
  moderationResource: ModerationResource
  setShowResourceWhistleblowModal: React.Dispatch<React.SetStateAction<boolean>>
  setResourceWhistleblowModal: React.Dispatch<React.SetStateAction<JSX.Element | null>>
  toggleShowResourceFlagsModal: React.Dispatch<React.SetStateAction<number | undefined>>
  // bodyItems: (AddonItem | null)[]
  // setShowReasonsModal: React.Dispatch<React.SetStateAction<number | undefined>>
  // setShowStatusModal: React.Dispatch<React.SetStateAction<number | undefined>>
  // setIsToDelete: React.Dispatch<React.SetStateAction<number | undefined>>
  // setShowDeleteReportsSnackbar: React.Dispatch<React.SetStateAction<string | undefined>>
  // setDisplayNameToDelete: React.Dispatch<React.SetStateAction<string>>
}> = ({
  id,
  moderationResource,
  setResourceWhistleblowModal,
  setShowResourceWhistleblowModal,
  toggleShowResourceFlagsModal,
  // setShowReasonsModal,
  // setShowStatusModal,
  // setIsToDelete,
  // setShowDeleteReportsSnackbar,
  // setDisplayNameToDelete,
  //bodyItems,
}) => {
  const { title, resourceHref, user, whistleblows, mainReportReason } = moderationResource
  const { displayName, email, profileHref, currentStatus, statusHistory } = user
  // const { user, toggleIsPublisher, deleteReports } = moderationUser

  // const statusIcons = {
  //   'Admin': { icon: <ManageAccountsOutlined />, title: 'Admin\nShow status changes' },
  //   'Publisher': { icon: <HowToRegOutlined />, title: 'Publisher\nShow status changes' },
  //   'Non-publisher': {
  //     icon: <PersonOutlineOutlined />,
  //     title: 'Non publisher\nShow status changes',
  //   },
  //   'Deleted': { icon: <PersonOffOutlined />, title: 'Deleted' },
  // }

  // const statusInfo = statusIcons[currentStatus as keyof typeof statusIcons]

  // const accountStatus = statusInfo && (
  //   <abbr title={statusInfo.title} key={currentStatus} onClick={() => setShowStatusModal(id)}>
  //     {statusInfo.icon}
  //   </abbr>
  // )

  const lastReport =
    whistleblows.length > 0
      ? whistleblows.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
      : null
  const lastReportDateRaw = lastReport ? new Date(lastReport.date) : null
  const lastReportDate = lastReportDateRaw
    ? lastReportDateRaw
        .toLocaleString('default', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
        .replace(',', '')
    : ''
  const lastReportTime = lastReportDateRaw
    ? lastReportDateRaw.toLocaleString('default', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    : ''

  return (
    <div className="table-row" key={id}>
      <abbr className={`resource-name`} title={`Go to resource page`}>
        <Link href={resourceHref} target="_blank">
          {title}
        </Link>
      </abbr>
      <abbr
        className="reports"
        title="Show report details"
        onClick={() => {
          toggleShowResourceFlagsModal(id)
        }}
      >
        {whistleblows.length}
      </abbr>
      <abbr className="last-flag" title={`${lastReportDate}, ${lastReportTime}`}>
        {lastReportDate}
      </abbr>
      <abbr
        className="reason"
        title="Show reason details"
        onClick={() => {
          setShowResourceWhistleblowModal(true)
          setResourceWhistleblowModal(
            <WhistleblownResourcesModal
              whistleblows={whistleblows}
              setIsShowingWhistleblows={setShowResourceWhistleblowModal}
            />,
          )
        }}
      >
        {mainReportReason}
      </abbr>
      <abbr
        className={`display-name ${currentStatus === 'Deleted' ? 'deleted' : ''}`}
        title={
          currentStatus === 'Deleted' ? 'Deleted user, anonymous' : `Go to profile page\n${email}`
        }
      >
        {currentStatus !== 'Deleted' ? (
          <Link href={profileHref} target="_blank">
            {displayName}
          </Link>
        ) : (
          `Deleted - ${
            statusHistory[0]?.date
              ? new Date(statusHistory[0].date)
                  .toLocaleString('default', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                  .replace(',', '')
              : ''
          }`
        )}
      </abbr>
      <div className="actions">
        <abbr
          onClick={() => {
            if (currentStatus !== 'Deleted') {
              // deleteReports()
              // setShowDeleteReportsSnackbar(user.title)
            }
          }}
          className={`remove-flags ${currentStatus === 'Deleted' ? 'disabled' : ''}`}
          title={currentStatus === 'Deleted' ? 'Cannot remove flags from a deleted user' : 'Remove'}
        >
          <RemoveFlag />
        </abbr>
        <abbr
          // onClick={() => toggleIsPublisher()}
          className={`unapprove ${
            (['Non-authenticated', 'Admin', 'Deleted'] as UserStatus[]).includes(currentStatus)
              ? 'disabled'
              : ''
          }`}
          title={
            currentStatus === 'Admin'
              ? 'Cannot unapprove an admin'
              : currentStatus === 'Publisher'
              ? 'Unapprove user'
              : currentStatus === 'Deleted'
              ? 'Cannot unapprove a deleted user'
              : currentStatus === 'Non-publisher'
              ? 'Approve user'
              : currentStatus === 'Non-authenticated'
              ? 'Cannot unapprove a non-authenticated user'
              : undefined
          }
        >
          {currentStatus === 'Non-publisher' ? <CheckCircleOutline /> : <Unpublished />}
        </abbr>
        <abbr
          onClick={() => {
            if (currentStatus !== 'Admin') {
              // setIsToDelete(id)
              // setDisplayNameToDelete(user.title)
            }
          }}
          className={`delete ${
            currentStatus === 'Admin' || currentStatus === 'Deleted' ? 'disabled' : ''
          }`}
          title={currentStatus === 'Admin' ? 'Cannot delete an admin' : 'Delete user'}
        >
          <PersonOffOutlined />
        </abbr>
      </div>
      {/* {bodyItems.map((item, i) => {
        return (
          <div key={(item && item.key) ?? i} id={item ? item.key.toString() : ''}>
            {item && item.Item ? <item.Item key={item.key} /> : null}
          </div>
        )
      })} */}
    </div>
  )
}

export const Moderation: FC<ModerationProps> = ({ users, resources, sort, search, tableItems }) => {
  const usersTableItems: (AddonItem | null)[][] = users.map(() => [])
  users.map(({ user }, i) /* user */ => {
    const newUserTableItem = usersTableItems && usersTableItems[i]
    tableItems.map(tableItem => {
      const email = tableItem ? tableItem.body.email : null
      tableItem &&
        tableItem.body &&
        newUserTableItem &&
        newUserTableItem.push(email === user.email ? tableItem.body.element : null)
    })
  })

  const [activeSort, setActiveSort] = useState<keyof ModerationProps['sort'] | undefined>(undefined)

  const userTableHeader = () => {
    const createSortColumn = (
      sortKey: keyof ModerationProps['sort'],
      label: string,
      className: string,
    ) => (
      <div
        className={`${className} ${activeSort === sortKey ? 'active' : ''}`}
        onClick={() => {
          setActiveSort(activeSort === sortKey ? undefined : sortKey)
          sort[sortKey]()
        }}
      >
        <div className="label">{label}</div>
        {activeSort === sortKey ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      </div>
    )

    return (
      <div className="table-header users-table">
        {createSortColumn('sortByDisplayName', 'Display name', 'display-name')}
        {createSortColumn('sortByFlags', 'Flags', 'flags')}
        {createSortColumn('sortByLastFlag', 'Last flag', 'last-flag')}
        {createSortColumn('sortByMainReason', 'Main reason', 'reason')}
        {createSortColumn('sortByStatus', 'Status', 'status')}
        <div className="actions">Actions</div>
      </div>
    )
  }

  const resourceTableHeader = () => {
    const createSortColumn = (
      sortKey: keyof ModerationProps['sort'],
      label: string,
      className: string,
    ) => (
      <div
        className={`${className} ${activeSort === sortKey ? 'active' : ''}`}
        onClick={() => {
          setActiveSort(activeSort === sortKey ? undefined : sortKey)
          sort[sortKey]()
        }}
      >
        <div className="label">{label}</div>
        {activeSort === sortKey ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      </div>
    )

    return (
      <div className="table-header resources-table">
        {createSortColumn('sortByResourceName', 'Name', 'resource-name')}
        {createSortColumn('sortByFlags', 'Flags', 'flags')}
        {createSortColumn('sortByLastFlag', 'Last flag', 'last-flag')}
        {createSortColumn('sortByMainReason', 'Main reason', 'reason')}
        {createSortColumn('sortByDisplayName', 'Creator', 'display-name')}
        {/* {createSortColumn('sortByStatus', 'Status', 'status')} */}
        <div className="actions">Actions</div>
      </div>
    )
  }

  const [showDeleteReportsSnackbar, setShowDeleteReportsSnackbar] = useState<string | undefined>(
    undefined,
  )

  const DeleteReportsSnackbar = showDeleteReportsSnackbar ? (
    <Snackbar
      onClose={() => setShowDeleteReportsSnackbar(undefined)}
      type="success"
      key={'delete-reports-snackbar'}
    >
      {showDeleteReportsSnackbar} flags ignored
    </Snackbar>
  ) : null

  const [showUserFlagsModal, toggleShowUserFlagsModal] = useState<number | undefined>(undefined)
  const [showResourceFlagsModal, toggleShowResourceFlagsModal] = useState<number | undefined>(
    undefined,
  )

  const flagRow = (user: UserReporter, date: string | Date, i: number) => {
    const newDate = typeof date === 'string' ? new Date(date) : date
    return (
      <div className="flag-row" key={i}>
        <div className="date">
          {newDate
            .toLocaleString('default', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })
            .replace(',', '')}
        </div>{' '}
        by{' '}
        <abbr title={`Go to profile page\n${user.email}`}>
          {' '}
          <Link href={user.profileHref} target="_blank">
            {user.displayName}
          </Link>
        </abbr>
      </div>
    )
  }
  const userFlagsModal =
    typeof showUserFlagsModal === 'number' ? (
      <Modal
        className="flag-modal"
        key="flag-modal"
        title="Reported by"
        onClose={() => toggleShowUserFlagsModal(undefined)}
      >
        {users[showUserFlagsModal]?.user.reports.map((report, index) =>
          flagRow(report.user, report.date, index),
        )}
      </Modal>
    ) : null

  const resourceFlagsModal =
    typeof showResourceFlagsModal === 'number' ? (
      <Modal
        className="flag-modal"
        key="flag-modal"
        title="Reported by"
        onClose={() => toggleShowResourceFlagsModal(undefined)}
      >
        {resources[showResourceFlagsModal]?.whistleblows.map((whistleblow, index) =>
          flagRow(whistleblow.user, whistleblow.date, index),
        )}
      </Modal>
    ) : null

  const [isToDelete, setIsToDelete] = useState<number | undefined>(undefined)
  const [displayNameToDelete, setDisplayNameToDelete] = useState<string>('')

  const deleteConfirmation = typeof isToDelete === 'number' && (
    <Modal
      title={`Alert`}
      actions={
        <PrimaryButton
          onClick={() => {
            users[isToDelete]?.deleteUser()
            setShowDeletedUserSnackbar(true)
            setIsToDelete(undefined)
          }}
          color="red"
        >
          Delete {displayNameToDelete}
        </PrimaryButton>
      }
      onPressEnter={() => {
        users[isToDelete]?.deleteUser()
        setShowDeletedUserSnackbar(true)
        setIsToDelete(undefined)
      }}
      onClose={() => setIsToDelete(undefined)}
      style={{ maxWidth: '450px' }}
      className="delete-message"
      key="delete-message-modal"
    >
      <b>{users[isToDelete]?.user.title}</b> will be <b>totally removed from the system</b>.<br />
      <br />
      Notice: All user content will be deleted, only report logs will be kept anonymously.
    </Modal>
  )

  const [showStatusModal, setShowStatusModal] = useState<number | undefined>(undefined)

  const getStatusVerb = (status: UserStatus): string =>
    ({
      'Non-authenticated': 'Unauthenticated ',
      'Non-publisher': 'Unapproved',
      'Admin': 'Made admin',
      'Publisher': 'Approved',
      'Deleted': 'Deleted',
    }[status])

  const statusModal = typeof showStatusModal === 'number' && (
    <Modal
      className="status-modal"
      title="Status changes"
      onClose={() => setShowStatusModal(undefined)}
      key="report-reasons-modal"
      style={{ maxWidth: '800px' }}
    >
      <div className="status-changes">
        {users[showStatusModal]?.user.statusHistory.map((statusChange, index) => (
          <div key={index} className="status-change">
            <div className="status">{getStatusVerb(statusChange.status)} by</div>
            <abbr title={`Go to profile page\n${statusChange.userChangedStatus.email}`}>
              <Link href={statusChange.userChangedStatus.profileHref} target="_blank">
                {statusChange.userChangedStatus.displayName}
              </Link>
            </abbr>{' '}
            on
            <div className="date">
              {new Date(statusChange.date)
                .toLocaleString('default', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })
                .replace(',', '')}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )

  const [showReasonsModal, setShowReasonsModal] = useState<number | undefined>(undefined)
  const [collapsedGroups, setCollapsedGroups] = useState<{ [key: string]: boolean }>({})

  const selectedUserReports = useMemo(() => {
    return showReasonsModal !== undefined ? users[showReasonsModal]?.user.reports : []
  }, [showReasonsModal, users])

  useEffect(() => {
    const initialCollapsedState = (selectedUserReports ?? []).reduce(acc => {
      // const reasonName = report.reason.type.name as ReportProfileReasonName
      // acc[reasonName] = true // All reasons start as collapsed
      return acc
    }, {} as { [key in ReportProfileReasonName]: boolean })

    setCollapsedGroups(initialCollapsedState)
  }, [selectedUserReports])

  const ReasonsModal = () => {
    const [initialCollapseFinished, setInitialCollapseFinished] = useState(false)

    // useEffect(() => {
    //   const newCollapsedGroups: { [reason in ReportProfileReasonName]?: boolean } = {}
    //   selectedUserReports?.reduce((acc, report) => {
    //     const reasonName = report.reason.type.name as ReportProfileReasonName
    //     acc[reasonName] = true // Initialize all reasons as collapsed
    //     return acc
    //   }, newCollapsedGroups)
    //   setCollapsedGroups(newCollapsedGroups)
    // }, [])

    const groupedReports = selectedUserReports?.reduce(
      (acc: { [key: string]: UserReport[] }, report) => {
        const reasonName = report.reason.type.name
        acc[reasonName] = acc[reasonName] || []
        acc[reasonName]?.push(report)
        return acc
      },
      {},
    )

    const sortedReasons = Object.entries(groupedReports || {}).sort(
      (a, b) => b[1].length - a[1].length,
    )

    const toggleGroupCollapse = (reason: string) => {
      setCollapsedGroups(prev => ({ ...prev, [reason]: !prev[reason] }))
    }

    const onClose = () => {
      setShowReasonsModal(undefined)
      setInitialCollapseFinished(false)
    }

    setTimeout(() => {
      typeof showReasonsModal === 'number' && setInitialCollapseFinished(true)
    }, 10)

    return (
      typeof showReasonsModal === 'number' &&
      initialCollapseFinished && (
        <Modal
          className="reasons-modal"
          title="Report reasons"
          onClose={onClose}
          key="report-reasons-modal"
          style={{ maxWidth: '800px' }}
        >
          <div className="reasons">
            {sortedReasons.map(([reason, reports]) => (
              <div key={reason} className="reason-type">
                <div className="type-header" onClick={() => toggleGroupCollapse(reason)}>
                  <h3 className="type">
                    {reason} ({reports.length})
                  </h3>
                  {collapsedGroups[reason] ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
                </div>
                {!collapsedGroups[reason] &&
                  reports.map((report, index) => (
                    <div key={index} className="reason">
                      <div className="date-user">
                        <div className="date">
                          {new Date(report.date)
                            .toLocaleString('default', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false,
                            })
                            .replace(',', '')}
                        </div>
                        <abbr className="user" title={`Go to profile page\n${report.user.email}`}>
                          <Link href={report.user.profileHref} target="_blank">
                            {report.user.displayName}
                          </Link>
                        </abbr>
                      </div>
                      <div className="comment">{report.reason.comment}</div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </Modal>
      )
    )
  }

  const [showDeletedUserSnackbar, setShowDeletedUserSnackbar] = useState<boolean>(false)

  const DeletedUserSnackbar = showDeletedUserSnackbar ? (
    <Snackbar
      onClose={() => setShowDeletedUserSnackbar(false)}
      type="success"
      key={'delete-user-snackbar'}
    >
      {`${displayNameToDelete} deleted`}
    </Snackbar>
  ) : null

  const reportedUsersCard = (
    <Card className="column reported-users">
      <div className="subtitle">Reported users</div>
      <Searchbox
        key="users-searchbox"
        placeholder="Search by display name or email"
        searchText={''}
        setSearchText={search}
        search={search}
        showSearchButton={false}
      />
      <div className="table-container">
        {userTableHeader()}
        <div className="table-body-container">
          <div className="table-body users-table">
            {users.map((moderationUser, i) /* user */ => {
              return (
                <UserRow
                  id={i}
                  moderationUser={moderationUser}
                  bodyItems={usersTableItems[i] ?? []}
                  toggleShowUserFlagsModal={toggleShowUserFlagsModal}
                  setShowReasonsModal={setShowReasonsModal}
                  setShowStatusModal={setShowStatusModal}
                  setIsToDelete={setIsToDelete}
                  setShowDeleteReportsSnackbar={setShowDeleteReportsSnackbar}
                  setDisplayNameToDelete={setDisplayNameToDelete}
                  key={i}
                />
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )

  const [resourceWhistleblowModal, setResourceWhistleblowModal] = useState<JSX.Element | null>(null)
  const [showResourceWhistleblowModal, setShowResourceWhistleblowModal] = useState<boolean>(false)

  const reportedResourcesCard = (
    <Card className="column reported-users">
      <div className="subtitle">Reported resources</div>
      <Searchbox
        key="users-searchbox"
        placeholder="Search by name or user (name or email)"
        searchText={''}
        setSearchText={search}
        search={search}
        showSearchButton={false}
      />
      <div className="table-container">
        {resourceTableHeader()}
        <div className="table-body-container">
          <div className="table-body resources-table">
            {resources.map((moderationResource, i) /* user */ => {
              return (
                <ResourceRow
                  id={i}
                  moderationResource={moderationResource}
                  setResourceWhistleblowModal={setResourceWhistleblowModal}
                  setShowResourceWhistleblowModal={setShowResourceWhistleblowModal}
                  toggleShowResourceFlagsModal={toggleShowResourceFlagsModal}
                  // bodyItems={usersTableItems[i] ?? []}
                  // setShowReasonsModal={setShowReasonsModal}
                  // setShowStatusModal={setShowStatusModal}
                  // setIsToDelete={setIsToDelete}
                  // setShowDeleteReportsSnackbar={setShowDeleteReportsSnackbar}
                  // setDisplayNameToDelete={setDisplayNameToDelete}
                  key={i}
                />
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )

  const snackbars = <SnackbarStack snackbarList={[DeleteReportsSnackbar, DeletedUserSnackbar]} />
  const modals = [
    userFlagsModal,
    resourceFlagsModal,
    ReasonsModal(),
    statusModal,
    deleteConfirmation,
    showResourceWhistleblowModal && resourceWhistleblowModal,
  ]

  return (
    <div className="moderation" key="Moderation">
      {snackbars}
      {modals}
      <Card className="column">
        <div className="title">Moderation</div>
      </Card>
      {reportedUsersCard}
      {reportedResourcesCard}
    </div>
  )
}
