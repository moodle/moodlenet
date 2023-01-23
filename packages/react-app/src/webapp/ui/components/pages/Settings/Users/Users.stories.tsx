import { action } from '@storybook/addon-actions'
import { FC } from 'react'
import { SettingsItem } from '../Settings/Settings.js'
import { Users, UsersMenu, UsersProps } from './Users.js'

export const useUsersStoryProps = (overrides?: { props?: Partial<UsersProps> }): UsersProps => {
  return {
    users: [
      {
        user: {
          displayName: 'Maria Anders',
          email: 'maria.anders@school.edu',
          isAdmin: false,
        },
        toggleIsAdmin: action('Toggeling user type'),
      },
      {
        user: {
          displayName: 'Josef Stevenson',
          email: 'josef.stevenson@university.edu',
          isAdmin: true,
        },
        toggleIsAdmin: action('Toggeling user type'),
      },
      {
        user: {
          displayName: 'Veronica Velazquez',
          email: 'vero.velazquez@next-school.edu',
          isAdmin: true,
        },
        toggleIsAdmin: action('Toggeling user type'),
      },
      {
        user: {
          displayName: 'Alfred Nobel Tschekov',
          email: 'alfrednt@old-university.edu',
          isAdmin: false,
        },
        toggleIsAdmin: action('Toggeling user type'),
      },
    ],
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
