import { JiraButtonBody, JiraButtonHead } from '@moodlenet/mn-central-jira-simple-moderations/ui'
import { href } from '@moodlenet/react-app/common'
import type { AdminSettingsItem } from '@moodlenet/react-app/ui'
import type { TableItem, UsersProps } from '@moodlenet/web-user/ui'
import { Users, UsersMenu } from '@moodlenet/web-user/ui'
import { action } from '@storybook/addon-actions'
import type { FC } from 'react'

export const useUsersStoryProps = (overrides?: {
  props?: Partial<UsersProps>
}): Omit<UsersProps, 'search'> => {
  const jiraLinkButtons: TableItem = {
    head: JiraButtonHead,
    body: {
      email: 'maria.anders@school.edu',
      element: JiraButtonBody('https://tracker.moodle.org/browse/MNM-647'),
    },
  }
  return {
    users: [
      {
        user: {
          title: 'Maria Anders',
          email: 'maria.anders@school.edu',
          profileHref: href('Pages/Profile/Admin'),
          isAdmin: false,
          isPublisher: false,
        },
        toggleIsAdmin: action('Toggeling user type'),
        toggleIsPublisher: action('Toggeling user type'),
      },
      {
        user: {
          title: 'Josef Stevenson',
          email: 'josef.stevenson@university.edu',
          profileHref: href('Pages/Profile/Admin'),
          isAdmin: true,
          isPublisher: true,
        },
        toggleIsAdmin: action('Toggeling user type'),
        toggleIsPublisher: action('Toggeling user type'),
      },
      {
        user: {
          title: 'Veronica Velazquez',
          email: 'vero.velazquez@next-school.edu',
          profileHref: href('Pages/Profile/Admin'),
          isAdmin: true,
          isPublisher: true,
        },
        toggleIsAdmin: action('Toggeling user type'),
        toggleIsPublisher: action('Toggeling user type'),
      },
      {
        user: {
          title: 'Alfred Nobel Tschekov',
          email: 'alfrednt@old-university.edu',
          profileHref: href('Pages/Profile/Admin'),
          isAdmin: false,
          isPublisher: true,
        },
        toggleIsAdmin: action('Toggeling user type'),
        toggleIsPublisher: action('Toggeling user type'),
      },
    ],
    tableItems: [jiraLinkButtons],
    ...overrides?.props,
  }
}

const UsersItem: FC = () => {
  // const canSubmit = form.dirty && form.isValid && !form.isSubmitting && !form.isValidating
  // const [searchText, setSearchText] = useState('')
  // const [currentUsers, setCurrentUsers] = useState(useUsersStoryProps().users)

  // useEffect(() => {
  //   setCurrentUsers(
  //     currentUsers.filter(
  //       ({ user }) =>
  //         user.title.toLowerCase().includes(searchText.toLowerCase()) ||
  //         user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
  //         searchText === '',
  //     ),
  //   )
  // }, [searchText, currentUsers])

  return (
    <Users
      users={useUsersStoryProps().users}
      search={action('Searching users')}
      // users={currentUsers}
      // search={setSearchText}
      tableItems={useUsersStoryProps().tableItems}
    />
  )
}
export const useUserAdminSettingsElements = (): AdminSettingsItem => {
  return {
    Menu: UsersMenu,
    Content: () => <UsersItem />,
    key: 'content-Users',
  }
}
