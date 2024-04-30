import { JiraButtonBody, JiraButtonHead } from '@moodlenet/mn-central-jira-simple-moderations/ui'
import { href } from '@moodlenet/react-app/common'
import type { AdminSettingsItem } from '@moodlenet/react-app/ui'
import type { ModerationProps, ReportTableItem } from '@moodlenet/web-user/ui'
import { Moderation, ModerationMenu } from '@moodlenet/web-user/ui'
import { action } from '@storybook/addon-actions'
import type { FC } from 'react'

export const useModerationStoryProps = (overrides?: {
  props?: Partial<ModerationProps>
}): Omit<ModerationProps, 'search'> => {
  const jiraLinkButtons: ReportTableItem = {
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

const ModerationItem: FC = () => {
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
    <Moderation
      users={useModerationStoryProps().users}
      search={action('Searching users')}
      // users={currentUsers}
      // search={setSearchText}
      tableItems={useModerationStoryProps().tableItems}
    />
  )
}
export const useModerationAdminSettingsElements = (): AdminSettingsItem => {
  return {
    Menu: ModerationMenu,
    Content: () => <ModerationItem />,
    key: 'content-Moderation',
  }
}
