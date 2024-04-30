import type { AddonItem } from '@moodlenet/component-library'
import { Card, Searchbox } from '@moodlenet/component-library'
import { Link } from '@moodlenet/react-app/ui'
import {
  DeleteOutline,
  DoNotDisturb,
  HowToRegOutlined,
  PersonAddAlt1Outlined,
  PersonOffOutlined,
  PersonRemoveOutlined,
  VisibilityOff,
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

function randomTimeGenerator(): string {
  const randomDay: Date = randomDate(new Date(2023, 0, 1), new Date(2024, 11, 31))
  const randomHour: number = Math.floor(Math.random() * 24)
  const randomMinute: number = Math.floor(Math.random() * 60)
  randomDay.setHours(randomHour, randomMinute, 0, 0)
  return (
    `${randomDay.getDate().toString().padStart(2, '0')} ` +
    `${randomDay.toLocaleString('default', { month: 'short' })} ` +
    `${randomDay.getFullYear()}, ` +
    `${randomDay.getHours().toString().padStart(2, '0')}:` +
    `${randomDay.getMinutes().toString().padStart(2, '0')}`
  )
}

const reportReasons: string[] = [
  'Inappropriate behavior',
  'Impersonation',
  'Spamming',
  'Violation of terms of service',
  'Other',
]

const accountStatuses = [
  <abbr title="Automatically unapproved" key="auto-unapprove">
    <PersonAddAlt1Outlined />
  </abbr>,
  <abbr title="Publisher" key="publisher">
    <HowToRegOutlined />
  </abbr>,
  <abbr title="Authorised" key="authorised">
    <PersonRemoveOutlined />
  </abbr>,
  <abbr title="Deleted" key="deleted">
    <PersonOffOutlined />
  </abbr>,
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
  return (
    <tr>
      <td>
        <abbr title={user.email}>
          <Link href={user.profileHref} target="_blank">
            {user.title}
          </Link>
        </abbr>
      </td>
      <td>{Math.floor(Math.random() * (15 - 1 + 1)) + 1}</td>
      <td className="last-flag">{randomTimeGenerator()}</td>
      <td className="reason">{reportReasons[Math.floor(Math.random() * reportReasons.length)]}</td>
      <td className="status">
        {accountStatuses[Math.floor(Math.random() * accountStatuses.length)]}
      </td>
      {/* <td>
        <Link href={user.profileHref} target="_blank">
          {user.email}
        </Link>
      </td> */}
      <td className="actions">
        <abbr onClick={toggleIsAdmin} className={`ignore`} title="Ignore">
          <VisibilityOff />
        </abbr>
        <abbr onClick={toggleIsPublisher} className={`unapprove`} title="Unapprove">
          <DoNotDisturb />
        </abbr>
        <abbr onClick={toggleIsPublisher} className={`delete`} title="Delete">
          <DeleteOutline />
        </abbr>
      </td>
      {/* {bodyItems.map((item, i) => {
        return (
          <td key={(item && item.key) ?? i} id={item ? item.key.toString() : ''}>
            {item && item.Item ? <item.Item key={item.key} /> : null}
          </td>
        )
      })} */}
    </tr>
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
      <Card className="column">
        {/* <div className="subtitle">User types</div> */}
        <Searchbox
          key="users-searchbox"
          placeholder="Search by display name or email"
          searchText={''}
          setSearchText={search}
          search={search}
          showSearchButton={false}
        />
        <table className="users-table">
          <thead>
            <tr>
              <td>Display name</td>
              {/* <td>Email</td> */}
              <td className="flags">Flags</td>
              <td className="last-flag">Last flag</td>
              <td className="reason">Reason</td>
              <td className="status">Status</td>
              <td className="actions">Actions</td>
              {/* {tableItems &&
                tableItems.map((item, i) => {
                  return item && item.head ? (
                    <td key={i} id={item ? item.head.key.toString() : ''}>
                      <item.head.Item key={item.head.key} />
                    </td>
                  ) : null
                })} */}
            </tr>
          </thead>
          <tbody>
            {}
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
          </tbody>
        </table>
      </Card>
    </div>
  )
}
