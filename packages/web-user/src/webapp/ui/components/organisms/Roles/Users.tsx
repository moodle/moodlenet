import { Card, Searchbox } from '@moodlenet/component-library'
import type { FC } from 'react'
import type { User } from '../../../../../common/types.mjs'
import { ReactComponent as AdminIconOff } from '../../../assets/icons/admin-settings-outlined.svg'
import { ReactComponent as AdminIconOn } from '../../../assets/icons/admin-settings.svg'
import './Users.scss'

/**
 search, filter non devono stare 
 */

export type UsersProps = {
  users: {
    user: User
    toggleIsAdmin(): unknown
  }[]
  search(str: string): unknown
}

export const UsersMenu = () => <abbr title="Users">Users</abbr>

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
      <td>{user.title}</td>
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
        <div className="subtitle">User types</div>
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
