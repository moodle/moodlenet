import type { AddonItem } from '@moodlenet/component-library'
import { Card, Searchbox } from '@moodlenet/component-library'
import { Link } from '@moodlenet/react-app/ui'
import {
  ArchiveOutlined,
  HowToRegOutlined,
  ManageAccountsOutlined,
  PersonOffOutlined,
  PersonOutlineOutlined,
  PersonRemoveOutlined,
  Unpublished,
} from '@mui/icons-material'
import type { FC } from 'react'
import type { User } from '../../../../../common/types.mjs'
import './Moderation.scss'

/**
 search, filter non devono stare 
 */

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function randomTimeGenerator() {
  const randomDay: Date = randomDate(new Date(2023, 0, 1), new Date(2024, 11, 31))
  const randomHour: number = Math.floor(Math.random() * 24)
  const randomMinute: number = Math.floor(Math.random() * 60)
  randomDay.setHours(randomHour, randomMinute, 0, 0)

  const date =
    `${randomDay.getDate().toString().padStart(2, '0')} ` +
    `${randomDay.toLocaleString('default', { month: 'short' })} ` +
    `${randomDay.getFullYear()}`

  const time =
    `${randomDay.getHours().toString().padStart(2, '0')}:` +
    `${randomDay.getMinutes().toString().padStart(2, '0')}`

  return {
    date: date,
    time: time,
  }
}

const reportReasons: string[] = [
  'Inappropriate behavior',
  'Impersonation',
  'Spamming',
  'Terms of service violation',
  'Other',
]

export type ReportTableItem = {
  head: AddonItem
  body: { email: string; element: AddonItem }
}

export type ModerationProps = {
  users: {
    user: User
    toggleIsAdmin(): unknown
    toggleIsPublisher(): unknown
  }[]
  search(str: string): unknown
  tableItems: (ReportTableItem | null)[]
}

export const ModerationMenu = () => <abbr title="Moderation">Moderation</abbr>

const Row: FC<{
  user: User
  bodyItems: (AddonItem | null)[]
  toggleIsAdmin: () => unknown | Promise<unknown>
  toggleIsPublisher: () => unknown | Promise<unknown>
}> = ({
  toggleIsAdmin,
  toggleIsPublisher,
  //bodyItems,
  user,
}) => {
  const { date, time } = randomTimeGenerator()
  const { isAdmin, isPublisher } = user

  const accontStatus = isAdmin ? (
    <abbr title="Admin" key="admin">
      <ManageAccountsOutlined />
    </abbr>
  ) : isPublisher ? (
    <abbr title="Publisher" key="publisher">
      <HowToRegOutlined />
    </abbr>
  ) : !isPublisher ? (
    <abbr title="Non publisher" key="authorised">
      <PersonOutlineOutlined />
    </abbr>
  ) : (
    <abbr title="Automatically unapproved" key="auto-unapprove">
      <PersonRemoveOutlined />
    </abbr>
  )

  // <abbr title="Deleted" key="deleted">
  //   <PersonOffOutlined />
  // </abbr>,

  return (
    <div className="table-row">
      <abbr className="display-name" title={`Go to profile page\n${user.email}`}>
        <Link href={user.profileHref} target="_blank">
          {user.title}
        </Link>
      </abbr>
      <div className="flags">{Math.floor(Math.random() * (15 - 1 + 1)) + 1}</div>
      <abbr className="last-flag" title={date + ' ' + time}>
        {date}
      </abbr>
      <abbr className="reason" title="Show more info">
        {reportReasons[Math.floor(Math.random() * reportReasons.length)]}
      </abbr>
      <div className="status">{accontStatus}</div>
      <div className="actions">
        <abbr onClick={toggleIsAdmin} className={`archive`} title="Archive reports">
          <ArchiveOutlined />
        </abbr>
        <abbr
          onClick={() => isPublisher && toggleIsPublisher()}
          className={`unapprove ${!isPublisher || isAdmin ? 'disabled' : ''}`}
          title={
            isAdmin
              ? 'Cannot unapprove an admin'
              : isPublisher
              ? 'Unapprove user'
              : 'Cannot unapprove an unapproved user'
          }
        >
          <Unpublished />
        </abbr>
        <abbr
          onClick={() => !isAdmin && toggleIsPublisher()}
          className={`delete ${isAdmin ? 'disabled' : ''}`}
          title={isAdmin ? 'Cannot delete an admin' : 'Delete user'}
        >
          {/* <DeleteOutline /> */}
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

  return (
    <div className="moderation" key="Moderation">
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
            <div className="reason">Reason</div>
            <div className="status">Status</div>
            <div className="actions">Actions</div>
          </div>
          <div className="table-body-container">
            <div className="table-body">
              {users.map(({ user, toggleIsAdmin, toggleIsPublisher }, i) /* user */ => {
                return (
                  <Row
                    user={user}
                    toggleIsAdmin={toggleIsAdmin}
                    bodyItems={usersTableItems[i] ?? []}
                    toggleIsPublisher={toggleIsPublisher}
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
