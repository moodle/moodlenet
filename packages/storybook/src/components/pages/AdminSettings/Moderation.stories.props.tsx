import { href } from '@moodlenet/react-app/common'
import type { AdminSettingsItem } from '@moodlenet/react-app/ui'
import type { ReportProfileReasonName, UserReport, UserStatus } from '@moodlenet/web-user/common'
import type { ModerationProps, ModerationUser } from '@moodlenet/web-user/ui'
import { Moderation, ModerationMenu } from '@moodlenet/web-user/ui'
import { action } from '@storybook/addon-actions'
import { useCallback, useEffect, useMemo, useState, type FC } from 'react'

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

let emailCounter = 0

const generateRandomUserReport = (): UserReport => {
  emailCounter++
  const randomUserReport: UserReport = {
    user: {
      displayName: names[Math.floor(Math.random() * names.length)] || '',
      email: `${Math.random().toString(36).substring(7)}_${emailCounter}@school.edu`,
      profileHref: href('Pages/Profile/Admin'),
    },
    date: new Date(getRandomDate()), // Convert the string to a Date object
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

const generateRandomUserReports = (n: number): UserReport[] => {
  const userReports: UserReport[] = []
  for (let i = 0; i < n; i++) {
    const randomUserReport = generateRandomUserReport()
    userReports.push(randomUserReport)
  }
  return userReports
}

const emails = names.map((name, i) => `${name.split(' ').join('.')}${i}@school.edu`.toLowerCase())

const getRandomUser = (deleteReports: (email: string) => void): ModerationUser => {
  const randomIndex = Math.floor(Math.random() * names.length)
  return {
    user: {
      title: names[randomIndex] || '', // Assign an empty string as the default value
      email: emails[randomIndex] || '', // Assign an empty string as the default value
      profileHref: href('Pages/Profile/Admin'),
      isAdmin: Math.random() < 0.5,
      isPublisher: Math.random() < 0.5,
      reports: generateRandomUserReports(Math.floor(Math.random() * 10) + 1),
      mainReportReason: getRandomReason(),
    },
    toggleIsPublisher: () => console.log('Toggling user type'),
    deleteUser: () => console.log('Deleting user'), // Add the missing deleteUser property
    deleteReports: () => {
      deleteReports(emails[randomIndex] || '')
      console.log('Email:', emails[randomIndex])
      console.log('Deleting reports')
    }, // Add the missing deleteReports property
  }
}

const createRandomUsers = (
  n: number,
  deleteReports: (email: string) => void,
): ReturnType<typeof getRandomUser>[] => {
  return Array.from({ length: n }, () => getRandomUser(deleteReports))
}

export const useModerationStoryProps = (overrides?: {
  props?: Partial<ModerationProps>
}): Omit<ModerationProps, 'search'> => {
  const [users, setUsers] = useState<ModerationUser[]>([])

  const deleteReports = useCallback((email: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.user.email !== email))
  }, [])

  const defaultUsers: ModerationUser[] = useMemo(
    () => [
      {
        user: {
          title: 'Maria Anders',
          email: 'maria.anders@school.edu',
          profileHref: href('Pages/Profile/Admin'),
          isAdmin: false,
          isPublisher: false,
          reports: [
            {
              user: {
                displayName: names[Math.floor(Math.random() * names.length)] || '',
                email: `${Math.random().toString(36).substring(7)}@school.edu`,
                profileHref: href('Pages/Profile/Admin'),
              },
              date: new Date(getRandomDate()),
              reason: {
                type: { id: '1', name: 'Inappropriate behavior' },
                comment: 'This is a comment',
              },
              status: 'Non-authenticated',
            },
            ...generateRandomUserReports(Math.floor(Math.random() * 10) + 1),
          ],
          mainReportReason: 'Inappropriate behavior',
        },
        toggleIsPublisher: () => console.log('Toggling user type'),
        deleteReports: () => {
          console.log('Deleting maria.anders@school.edu reports')
          deleteReports('maria.anders@school.edu')
        },
        deleteUser: () => console.log('Deleting user'),
      },
      ...createRandomUsers(5, deleteReports),
    ],
    [deleteReports],
  )

  useEffect(() => {
    setUsers(defaultUsers)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Include 'defaultUsers' as a dependency

  return {
    users,
    tableItems: [],
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
