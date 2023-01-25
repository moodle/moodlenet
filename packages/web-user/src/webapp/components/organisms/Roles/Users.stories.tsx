import { SettingsItem } from '@moodlenet/react-app/ui'
import { action } from '@storybook/addon-actions'
import { FC, useEffect, useState } from 'react'
import { Users, UsersMenu, UsersProps } from './Users.js'

export const useUsersStoryProps = (overrides?: {
  props?: Partial<UsersProps>
}): Omit<UsersProps, 'search'> => {
  return {
    users: [
      {
        user: {
          title: 'Maria Anders',
          email: 'maria.anders@school.edu',
          isAdmin: false,
        },
        toggleIsAdmin: action('Toggeling user type'),
      },
      {
        user: {
          title: 'Josef Stevenson',
          email: 'josef.stevenson@university.edu',
          isAdmin: true,
        },
        toggleIsAdmin: action('Toggeling user type'),
      },
      {
        user: {
          title: 'Veronica Velazquez',
          email: 'vero.velazquez@next-school.edu',
          isAdmin: true,
        },
        toggleIsAdmin: action('Toggeling user type'),
      },
      {
        user: {
          title: 'Alfred Nobel Tschekov',
          email: 'alfrednt@old-university.edu',
          isAdmin: false,
        },
        toggleIsAdmin: action('Toggeling user type'),
      },
    ],
    ...overrides?.props,
  }
}

const UsersItem: FC = () => {
  // const canSubmit = form.dirty && form.isValid && !form.isSubmitting && !form.isValidating
  const [searchText, setSearchText] = useState('')
  const [currentUsers, setCurrentUsers] = useState(useUsersStoryProps().users)

  useEffect(() => {
    setCurrentUsers(
      currentUsers.filter(
        ({ user }) =>
          user.title.toLowerCase().includes(searchText.toLowerCase()) ||
          user.email.toLowerCase().includes(searchText.toLowerCase()) ||
          searchText === '',
      ),
    )
  }, [searchText, currentUsers])

  return <Users users={currentUsers} search={setSearchText} />
}
export const useElements = (): SettingsItem => {
  return {
    Menu: UsersMenu,
    Content: { Item: UsersItem, key: 'content-Users' },
  }
}
