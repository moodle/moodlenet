import { JiraButtonBody, JiraButtonHead } from '@moodlenet/mn-central-jira-simple-moderations/ui'
import { href } from '@moodlenet/react-app/common'
import type { AdminSettingsItem } from '@moodlenet/react-app/ui'
import type { ReportProfileReasonName, UserReport, UserStatus } from '@moodlenet/web-user/common'
import type { ModerationProps, ReportTableItem } from '@moodlenet/web-user/ui'
import { Moderation, ModerationMenu } from '@moodlenet/web-user/ui'
import { action } from '@storybook/addon-actions'
import type { FC } from 'react'

const getRandomDate = (): string => {
  const start = new Date(2020, 0, 1)
  const end = new Date()
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString()
}

const getRandomStatus = (): UserStatus => {
  const statuses: UserStatus[] = ['Non-authenticated', 'Authenticated', 'Admin', 'Publisher']
  return statuses[Math.floor(Math.random() * statuses.length)] ?? 'Non-authenticated'
}

const getRandomReason = (): ReportProfileReasonName => {
  const reasons: ReportProfileReasonName[] = [
    'Inappropriate behavior',
    'Impersonation',
    'Spamming',
    'Terms of service violation',
    'Other',
  ]
  return reasons[Math.floor(Math.random() * reasons.length)] ?? 'Other'
}

const generateRandomUserReport = (): UserReport => {
  const randomUserReport: UserReport = {
    time: new Date().toISOString(),
    date: getRandomDate(),
    reason: {
      type: {
        id: Math.random().toString(36).substring(7),
        name: getRandomReason(),
      },
      comment: Math.random().toString(36).substring(7),
    },
    status: getRandomStatus(),
  }
  return randomUserReport
}

const names = [
  'Maria Anders',
  'Ana Trujillo',
  'Antonio Moreno',
  'Thomas Hardy',
  'Christina Berglund',
  'Hanna Moos',
  'Frederique Citeaux',
  'Martin Sommer',
  'Laurence Lebihan',
  'Elizabeth Lincoln',
]
const emails = names.map(name => `${name.split(' ').join('.')}@school.edu`.toLowerCase())

const getRandomUser = () => {
  const randomIndex = Math.floor(Math.random() * names.length)
  return {
    user: {
      title: names[randomIndex],
      email: emails[randomIndex],
      profileHref: href('Pages/Profile/Admin'),
      isAdmin: Math.random() < 0.5,
      isPublisher: Math.random() < 0.5,
      reports: Array.from({ length: Math.floor(Math.random() * 10) }, generateRandomUserReport),
    },
    toggleIsAdmin: () => console.log('Toggling user type'),
    toggleIsPublisher: () => console.log('Toggling user type'),
  }
}

const createRandomUsers = (n: number): ReturnType<typeof getRandomUser>[] => {
  return Array.from({ length: n }, getRandomUser)
}

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
          reports: [
            {
              time: '11:30',
              date: '2021-08-04',
              reason: {
                type: { id: '1', name: 'Inappropriate behavior' },
                comment: 'This is a comment',
              },
              status: 'Non-authenticated',
            },
          ],
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
          reports: [
            {
              time: '11:30',
              date: '2021-08-04',
              reason: {
                type: { id: '1', name: 'Inappropriate behavior' },
                comment: 'This is a comment',
              },
              status: 'Non-authenticated',
            },
            {
              time: '11:30',
              date: '2021-08-04',
              reason: {
                type: { id: '1', name: 'Inappropriate behavior' },
                comment: 'This is a comment',
              },
              status: 'Non-authenticated',
            },
          ],
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
          reports: [
            {
              time: '11:30',
              date: '2021-08-04',
              reason: {
                type: { id: '1', name: 'Inappropriate behavior' },
                comment: 'This is a comment',
              },
              status: 'Non-authenticated',
            },
          ],
        },
        toggleIsAdmin: action('Toggeling user type'),
        toggleIsPublisher: action('Toggeling user type'),
      },
      ...createRandomUsers(5),
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
