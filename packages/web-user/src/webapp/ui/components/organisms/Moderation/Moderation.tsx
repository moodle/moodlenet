import type { AddonItem } from '@moodlenet/component-library'
import { Card, Searchbox } from '@moodlenet/component-library'
import { Link } from '@moodlenet/react-app/ui'
import {
  DeleteOutline,
  DoNotDisturb,
  HowToRegOutlined,
  PersonOffOutlined,
  PersonOutlineOutlined,
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

const accountStatuses = [
  <abbr title="Automatically unapproved" key="auto-unapprove">
    <PersonRemoveOutlined />
  </abbr>,
  <abbr title="Publisher" key="publisher">
    <HowToRegOutlined />
  </abbr>,
  <abbr title="Authorised" key="authorised">
    <PersonOutlineOutlined />
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
  const { date, time } = randomTimeGenerator()
  return (
    <tr>
      <td className="display-name">
        <abbr title={user.email}>
          <Link href={user.profileHref} target="_blank">
            {user.title}
          </Link>
        </abbr>
      </td>
      <td className="flags">{Math.floor(Math.random() * (15 - 1 + 1)) + 1}</td>
      <td className="last-flag">
        <abbr title={time}>{date}</abbr>
      </td>
      <td className="reason">
        <abbr title="Show more info">
          {reportReasons[Math.floor(Math.random() * reportReasons.length)]}
        </abbr>
      </td>
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
          <div className="table">
            <table className="thead-table">
              <thead>
                <tr>
                  <th className="display-name">Display name</th>
                  <th className="flags">Flags</th>
                  <th className="last-flag">Last flag</th>
                  <th className="reason">Reason</th>
                  <th className="status">Status</th>
                  <th className="actions">Actions</th>
                </tr>
              </thead>
            </table>
            <table className="tbody-table">
              <tbody>
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
          </div>
        </div>
      </Card>
    </div>
  )
}
