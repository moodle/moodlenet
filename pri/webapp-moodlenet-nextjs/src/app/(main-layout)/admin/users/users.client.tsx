import type { AddonItem } from '@moodlenet/component-library'
import { Card, Searchbox } from '@moodlenet/component-library'
import { Link } from '@moodlenet/react-app/ui'
import {
  HowToReg,
  HowToRegOutlined,
  ManageAccounts,
  ManageAccountsOutlined,
} from '@mui/icons-material'
import type { FC } from 'react'
import type { User } from '../../../../../common/types.mjs'
import './Users.scss'

/**
 search, filter non devono stare
 */

export type TableItem = {
  head: AddonItem
  body: { email: string; element: AddonItem }
}

export type UsersProps = {
  users: {
    user: User
    toggleIsAdmin(): unknown
    toggleIsPublisher(): unknown
  }[]
  search(str: string): unknown
  tableItems: (TableItem | null)[]
}

export const UsersMenu = () => <abbr title="Users">Users</abbr>

const Row: FC<{
  user: User
  bodyItems: (AddonItem | null)[]
  toggleIsAdmin: () => unknown | Promise<unknown>
  toggleIsPublisher: () => unknown | Promise<unknown>
}> = ({ toggleIsAdmin, toggleIsPublisher, bodyItems, user }) => {
  return (
    <tr>
      <td>
        <Link href={user.profileHref} target="_blank">
          {user.title}
        </Link>
      </td>
      <td>
        <Link href={user.profileHref} target="_blank">
          {user.email}
        </Link>
      </td>
      <td className="user-types">
        <abbr
          onClick={toggleIsAdmin}
          className={`admin ${user.isAdmin ? 'on' : 'off'}`}
          title="Admin"
        >
          {user.isAdmin ? <ManageAccounts /> : <ManageAccountsOutlined />}
        </abbr>
        <abbr
          onClick={toggleIsPublisher}
          className={`publisher ${user.isPublisher ? 'on' : 'off'}`}
          title="Publisher"
        >
          {user.isPublisher ? <HowToReg /> : <HowToRegOutlined />}
        </abbr>
      </td>
      {bodyItems.map((item, i) => {
        return (
          <td key={(item && item.key) ?? i} id={item ? item.key.toString() : ''}>
            {item && item.Item ? <item.Item key={item.key} /> : null}
          </td>
        )
      })}
    </tr>
  )
}

export const Users: FC<UsersProps> = ({ users, search, tableItems }) => {
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
    <div className="users" key="Users">
      <Card className="column">
        <div className="title">
          {/* <Trans> */}
          Users
          {/* </Trans> */}
        </div>
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
              <td>Email</td>
              <td className="user-types">User types</td>
              {tableItems &&
                tableItems.map((item, i) => {
                  return item && item.head ? (
                    <td key={i} id={item ? item.head.key.toString() : ''}>
                      <item.head.Item key={item.head.key} />
                    </td>
                  ) : null
                })}
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
