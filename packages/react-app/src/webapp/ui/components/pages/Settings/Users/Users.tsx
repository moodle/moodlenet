import { AddonItem, Card, Searchbox } from '@moodlenet/component-library'
import { FC, useEffect, useState } from 'react'
import { User } from '../../../../../../common/types.mjs'
import { ReactComponent as AdminIconOff } from '../../../../assets/icons/admin-settings-outlined.svg'
import { ReactComponent as AdminIconOn } from '../../../../assets/icons/admin-settings.svg'
import './Users.scss'

export type UsersProps = {
  users: User[]
  toggleUserType(key: string, userType: string): void
  // toggleUserType(user: User, userType: string): void
}

export const UsersMenu: AddonItem = {
  Item: () => <span>Users</span>,
  key: 'menu-Users',
}

export const Users: FC<UsersProps> = ({ users, toggleUserType }) => {
  // const canSubmit = form.dirty && form.isValid && !form.isSubmitting && !form.isValidating
  const [searchText, setSearchText] = useState('')
  const [currentUsers, setCurrentUsers] = useState(users)

  useEffect(() => {
    setCurrentUsers(
      users.filter(
        user =>
          user.displayName.toLowerCase().includes(searchText.toLowerCase()) ||
          user.email.toLowerCase().includes(searchText.toLowerCase()) ||
          searchText === '',
      ),
    )
  }, [searchText, users])
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
        <Searchbox
          key="users-searchbox"
          placeholder="Search by display name or email"
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <table className="users-table">
          <thead>
            <tr>
              <td>Display name</td>
              <td>Email</td>
              <td className="user-types">User types</td>
            </tr>
          </thead>
          <tbody>
            {currentUsers?.map(({ displayName, email, key, userTypes }) /* user */ => {
              return (
                <tr key={key}>
                  <td>{displayName}</td>
                  <td>{email}</td>
                  <td className="user-types">
                    <abbr
                      onClick={() => toggleUserType(key, 'Admin')}
                      className={`admin ${userTypes.indexOf('Admin') > -1 ? 'on' : 'off'}`}
                      title="Admin"
                    >
                      {userTypes.indexOf('Admin') > -1 ? <AdminIconOn /> : <AdminIconOff />}
                    </abbr>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
