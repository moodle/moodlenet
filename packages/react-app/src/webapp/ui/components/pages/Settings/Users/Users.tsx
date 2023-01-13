import { AddonItem, Card, Searchbox } from '@moodlenet/component-library'
import { useFormik } from 'formik'
import { FC, useEffect, useState } from 'react'
import { User } from '../../../../../../common/types.mjs'
import { ReactComponent as AdminIconOff } from '../../../../assets/icons/admin-settings-outlined.svg'
import { ReactComponent as AdminIconOn } from '../../../../assets/icons/admin-settings.svg'
import './Users.scss'



export type UsersFormValues = {
  users: User[]
}

export type UsersProps = {
  form?: ReturnType<typeof useFormik<UsersFormValues>>
}

export const UsersMenu: AddonItem = {
  Item: () => <span>Users</span>,
  key: 'menu-Users',
}

export const Users: FC<UsersProps> = ({ form }) => {
  // const canSubmit = form.dirty && form.isValid && !form.isSubmitting && !form.isValidating
  const [searchText, setSearchText] = useState('')
  const [users, setUsers] = useState(form?.values.users)

  useEffect(() => {
    setUsers(
      form?.values.users.filter(
        user =>
          user.displayName.toLowerCase().includes(searchText.toLowerCase()) ||
          user.email.toLowerCase().includes(searchText.toLowerCase()) ||
          searchText === '',
      ),
    )
  }, [searchText, form?.values.users])
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
            {users?.map(user => {
              return (
                <tr key={user.email}>
                  <td>{user.displayName}</td>
                  <td>{user.email}</td>
                  <td className="user-types">
                    <abbr
                      onClick={() => user.toggleUserType('Admin')}
                      className={`admin ${user.userTypes.indexOf('Admin') > -1 ? 'on' : 'off'}`}
                      title="Admin"
                    >
                      {user.userTypes.indexOf('Admin') > -1 ? <AdminIconOn /> : <AdminIconOff />}
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
