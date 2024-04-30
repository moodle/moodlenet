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
  HowToRegOutlined,
  ManageAccountsOutlined,
  PersonOffOutlined,
  PersonOutlineOutlined,
  Unpublished,
} from '@mui/icons-material'
import { useState, type FC } from 'react'
import type { User, UserReporter } from '../../../../../common/types.mjs'
import { ReactComponent as RemoveFlag } from '../../../assets/icons/remove-flag.svg'
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

export type ModerationProps = {
  users: ModerationUser[]
  search(str: string): unknown
  tableItems: (ReportTableItem | null)[]
}

export const ModerationMenu = () => <abbr title="Moderation">Moderation</abbr>

const Row: FC<{
  id: number
  moderationUser: ModerationUser
  bodyItems: (AddonItem | null)[]
  toggleShowFlagModal: React.Dispatch<React.SetStateAction<number | undefined>>
  setIsToDelete: React.Dispatch<React.SetStateAction<number | undefined>>
  setShowDeleteReportsSnackbar: React.Dispatch<React.SetStateAction<string | undefined>>
}> = ({
  id,
  moderationUser,
  toggleShowFlagModal,
  setIsToDelete,
  setShowDeleteReportsSnackbar,
  //bodyItems,
}) => {
  const { user, toggleIsPublisher, deleteReports } = moderationUser
  const { mainReportReason, isAdmin, isPublisher } = user

  const accontStatus = isAdmin ? (
    <abbr title={`Admin\nShow status changes`} key="admin">
      <ManageAccountsOutlined />
    </abbr>
  ) : isPublisher ? (
    <abbr title={`Publisher\nShow status changes`} key="publisher">
      <HowToRegOutlined />
    </abbr>
  ) : (
    /* !isPublisher ? */ <abbr title={`Non publisher\nShow status changes`} key="authorised">
      <PersonOutlineOutlined />
    </abbr>
  )
  // : (
  //   <abbr title="Automatically unapproved" key="auto-unapprove">
  //     <PersonRemoveOutlined />
  //   </abbr>
  // )

  // <abbr title="Deleted" key="deleted">
  //   <PersonOffOutlined />
  // </abbr>,

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
      <abbr className="display-name" title={`Go to profile page\n${user.email}`}>
        <Link href={user.profileHref} target="_blank">
          {user.title}
        </Link>
      </abbr>
      <abbr
        className="flags"
        title="Show flag details"
        onClick={() => {
          toggleShowFlagModal(id)
        }}
      >
        {user.reports.length}
      </abbr>
      <abbr className="last-flag" title={`${lastReportDate}, ${lastReportTime}`}>
        {lastReportDate}
      </abbr>
      <abbr className="reason" title="Show reason details">
        {mainReportReason}
      </abbr>
      <div className="status">{accontStatus}</div>
      <div className="actions">
        <abbr
          onClick={() => {
            deleteReports()
            setShowDeleteReportsSnackbar(user.title)
          }}
          className={`remove-flags`}
          title="Ignore flags"
        >
          <RemoveFlag />
        </abbr>
        <abbr
          onClick={() => isPublisher && toggleIsPublisher()}
          className={`unapprove ${!isPublisher || isAdmin ? 'disabled' : ''}`}
          title={
            isAdmin
              ? 'Cannot unapprove an admin'
              : isPublisher
              ? 'Unapprove user'
              : 'User already not approved'
          }
        >
          <Unpublished />
        </abbr>
        <abbr
          onClick={() => !isAdmin && setIsToDelete(id)}
          className={`delete ${isAdmin ? 'disabled' : ''}`}
          title={isAdmin ? 'Cannot delete an admin' : 'Delete user'}
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

export const Moderation: FC<ModerationProps> = ({ users, search, tableItems }) => {
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

  const [showFlagModal, toggleShowFlagModal] = useState<number | undefined>(undefined)

  const flagRow = (user: UserReporter, date: Date, i: number) => {
    return (
      <div className="flag-row" key={i}>
        <abbr title={`Go to profile page\n${user.email}`}>{user.displayName}</abbr> on{' '}
        {date.toLocaleString('default', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}
      </div>
    )
  }
  const flagModal =
    typeof showFlagModal === 'number' ? (
      <Modal
        className="flag-modal"
        key="flag-modal"
        title="Reported by"
        onClose={() => toggleShowFlagModal(undefined)}
      >
        {showFlagModal &&
          users[showFlagModal]?.user.reports.map((report, index) =>
            flagRow(report.user, report.date, index),
          )}
      </Modal>
    ) : null

  const [isToDelete, setIsToDelete] = useState<number | undefined>(undefined)
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
          Delete user
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
      Notice: only report logs and non deleted content will be kept anonymously.
    </Modal>
  )

  const [showDeletedUserSnackbar, setShowDeletedUserSnackbar] = useState<boolean>(false)

  const DeletedUserSnackbar = showDeletedUserSnackbar ? (
    <Snackbar
      onClose={() => setShowDeletedUserSnackbar(false)}
      type="success"
      key={'delete-user-snackbar'}
    >
      User deleted
    </Snackbar>
  ) : null

  const snackbars = <SnackbarStack snackbarList={[DeleteReportsSnackbar, DeletedUserSnackbar]} />

  const modals = [flagModal, deleteConfirmation]

  return (
    <div className="moderation" key="Moderation">
      {snackbars}
      {modals}
      <Card className="column">
        <div className="title">Moderation</div>
      </Card>
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
          <div className="table-header">
            <div className="display-name">Display name</div>
            <div className="flags">Flags</div>
            <div className="last-flag">Last flag</div>
            <div className="reason">Main reason</div>
            <div className="status">Status</div>
            <div className="actions">Actions</div>
          </div>
          <div className="table-body-container">
            <div className="table-body">
              {users.map((moderationUser, i) /* user */ => {
                return (
                  <Row
                    id={i}
                    moderationUser={moderationUser}
                    bodyItems={usersTableItems[i] ?? []}
                    toggleShowFlagModal={toggleShowFlagModal}
                    setIsToDelete={setIsToDelete}
                    setShowDeleteReportsSnackbar={setShowDeleteReportsSnackbar}
                    key={i}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
