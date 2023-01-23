import { AddonItem, Card, Searchbox } from '@moodlenet/component-library'
import { useFormik } from 'formik'
import { FC, useEffect, useState } from 'react'
import { User } from '../../../../../../common/types.mjs'
import { ReactComponent as AdminIconOff } from '../../../../assets/icons/admin-settings-outlined.svg'
import { ReactComponent as AdminIconOn } from '../../../../assets/icons/admin-settings.svg'
import './Users.scss'

/**
 search, filter non devono stare 
 */

export type UsersProps = {
  users: {
    user: User
    toggleIsAdmin(): unknown
  }[]
}

export const UsersMenu: AddonItem = {
  Item: () => <span>Users</span>,
  key: 'menu-Users',
}

const Row: FC<{
  user: User
  // editUser: (User: User) =>  void | Promise<any>
  toggleIsAdmin: () => unknown | Promise<unknown>
}> = ({ /* editUser */ toggleIsAdmin, user }) => {
  const form = useFormik<User>({
    initialValues: user,
    // validate:yup,
    onSubmit: (/* values */) => {
      ///
      // return editUser(values)
    },
  })
  return (
    <tr>
      <td>{form.values.displayName}</td>
      <td>{form.values.email}</td>
      <td className="user-types">
        <abbr
          onClick={toggleIsAdmin}
          className={`admin ${form.values.isAdmin ? 'on' : 'off'}`}
          title="Admin"
        >
          {form.values.isAdmin ? <AdminIconOn /> : <AdminIconOff />}
        </abbr>
      </td>
    </tr>
  )
}

export const Users: FC<UsersProps> = ({ users }) => {
  // const canSubmit = form.dirty && form.isValid && !form.isSubmitting && !form.isValidating
  const [searchText, setSearchText] = useState('')
  const [currentUsers, setCurrentUsers] = useState(users)

  useEffect(() => {
    setCurrentUsers(
      users.filter(
        ({ user }) =>
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
            {currentUsers?.map(({ user, toggleIsAdmin }, i) /* user */ => {
              return <Row user={user} toggleIsAdmin={toggleIsAdmin} key={i} />
            })}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
