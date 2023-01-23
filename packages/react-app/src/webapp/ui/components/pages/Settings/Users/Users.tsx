import { AddonItem, Card, Searchbox } from '@moodlenet/component-library'
import { FC } from 'react'
import { User } from '../../../../../../common/types.mjs'
import { ReactComponent as AdminIconOff } from '../../../../assets/icons/admin-settings-outlined.svg'
import { ReactComponent as AdminIconOn } from '../../../../assets/icons/admin-settings.svg'
import './Users.scss'

export type UsersProps = {
  users: {
    user: User
    toggleIsAdmin(): unknown
  }[]
  search(str: string): unknown
}
export type UserTypeProps = {
  key: string
  displayName: string
  email: string
  userTypes: string[]
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
  // const form = useFormik<User>({
  //   initialValues: user,
  //   // validate:yup,
  //   onSubmit: (/* values */) => {
  //     ///
  //     // return editUser(values)
  //   },
  // })

  return (
    <tr>
      <td>{user.displayName}</td>
      <td>{user.email}</td>
      <td className="user-types">
        <abbr
          onClick={toggleIsAdmin}
          className={`admin ${user.isAdmin ? 'on' : 'off'}`}
          title="Admin"
        >
          {user.isAdmin ? <AdminIconOn /> : <AdminIconOff />}
        </abbr>
      </td>
    </tr>
  )
}

export const Users: FC<UsersProps> = ({ users, search }) => {
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
          searchText={''}
          setSearchText={search}
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
            {users.map(({ user, toggleIsAdmin }, i) /* user */ => {
              return <Row user={user} toggleIsAdmin={toggleIsAdmin} key={i} />
            })}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
