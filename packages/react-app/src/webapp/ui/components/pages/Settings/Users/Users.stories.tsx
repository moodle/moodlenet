import { action } from '@storybook/addon-actions'
import { FC } from 'react'
import { SettingsItem } from '../Settings/Settings.js'
import { Users, UsersMenu, UsersProps } from './Users.js'

export const useUsersStoryProps = (overrides?: { props?: Partial<UsersProps> }): UsersProps => {
  return {
    users: [
      {
        key: '1',
        displayName: 'Maria Anders',
        email: 'maria.anders@school.edu',
        userTypes: [],
      },
      {
        key: '1',
        displayName: 'Josef Stevenson',
        email: 'josef.stevenson@university.edu',
        userTypes: ['Admin'],
      },
      {
        key: '1',
        displayName: 'Veronica Velazquez',
        email: 'vero.velazquez@next-school.edu',
        userTypes: ['Admin'],
      },
      {
        key: '1',
        displayName: 'Alfred Nobel Tschekov',
        email: 'alfrednt@old-university.edu',
        userTypes: [],
      },
    ],
    toggleUserType: action('Toggeling user type'),
    ...overrides?.props,
  }
}

const UsersItem: FC = () => <Users {...useUsersStoryProps()} />
export const useElements = (): SettingsItem => {
  return {
    Menu: UsersMenu,
    Content: { Item: UsersItem, key: 'content-Users' },
  }
}
