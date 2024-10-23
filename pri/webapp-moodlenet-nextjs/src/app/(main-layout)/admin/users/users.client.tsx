'use client'
import HowToReg from '@mui/icons-material/HowToReg'
import HowToRegOutlined from '@mui/icons-material/HowToRegOutlined'
import ManageAccounts from '@mui/icons-material/ManageAccounts'
import ManageAccountsOutlined from '@mui/icons-material/ManageAccountsOutlined'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import useQueryParams from '../../../../ui/lib/nextjs/queryParams'
import { sitepaths } from '../../../../lib/common/utils/sitepaths'
import { Card } from '../../../../ui/atoms/Card/Card'
import Searchbox from '../../../../ui/atoms/Searchbox/Searchbox'
import { userRecord, userRole } from '@moodle/module/user-account'
import { editUserRole } from './users.server'

export type UsersProps = {
  users: UserRow[]
}

export function UsersClient({ users }: UsersProps) {
  const { t } = useTranslation()
  const { setQueryParams } = useQueryParams()

  return (
    <div className="users" key="Users">
      <Card className="column">
        <div className="title">
          <Trans>Users</Trans>
        </div>
      </Card>
      <Card className="column">
        {/* <div className="subtitle">User types</div> */}
        <Searchbox
          key="users-searchbox"
          placeholder={t('Search by display name or email')}
          search={textSearch => setQueryParams({ textSearch })}
        />
        <table className="users-table">
          <thead>
            <tr>
              <td>
                <Trans>Display name</Trans>
              </td>
              <td>
                <Trans>Email</Trans>
              </td>
              <td className="user-types">
                <Trans>User types</Trans>
              </td>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <Row user={user} key={user.id} />
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

export type UserRow = Pick<userRecord, 'id' | 'contacts' | 'displayName' | 'roles'>
type RowProps = {
  user: UserRow
}

function Row({ user }: RowProps) {
  const { t } = useTranslation()
  const profileHref = sitepaths['user-profile'][user.id]!()
  const [roles, setRoles] = useState(user.roles)
  const isAdmin = roles.includes('admin')
  const isPublisher = roles.includes('publisher')
  const toggleRole = useCallback(
    (role: userRole) => {
      editUserRole({
        role,
        action: roles.includes(role) ? 'unset' : 'set',
        userId: user.id,
      }).then(setRoles)
    },
    [roles, user.id],
  )
  return (
    <tr>
      <td>
        <Link href={profileHref} target="_blank">
          {user.displayName}
        </Link>
      </td>
      <td>
        <Link href={profileHref} target="_blank">
          {user.contacts.email}
        </Link>
      </td>
      <td className="user-types">
        <abbr onClick={() => toggleRole('admin')} className={`admin ${isAdmin ? 'on' : 'off'}`} title={t('Admin')}>
          {isAdmin ? <ManageAccounts /> : <ManageAccountsOutlined />}
        </abbr>
        <abbr
          onClick={() => toggleRole('publisher')}
          className={`publisher ${isPublisher ? 'on' : 'off'}`}
          title={t('Publisher')}
        >
          {isPublisher ? <HowToReg /> : <HowToRegOutlined />}
        </abbr>
      </td>
    </tr>
  )
}
