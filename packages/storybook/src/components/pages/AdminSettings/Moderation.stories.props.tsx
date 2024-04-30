import { href } from '@moodlenet/react-app/common'
import type { AdminSettingsItem } from '@moodlenet/react-app/ui'
import type {
  ReportProfileReasonName,
  UserReport,
  UserStatus,
  UserStatusChange,
} from '@moodlenet/web-user/common'
import type { ModerationProps, ModerationUser, SortReportedUsers } from '@moodlenet/web-user/ui'
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
  const statuses: UserStatus[] = ['Non-publisher', 'Admin', 'Publisher', 'Deleted']
  return statuses[Math.floor(Math.random() * statuses.length)] ?? 'Non-authenticated'
}

const commentsByReason: Record<ReportProfileReasonName, string[]> = {
  'Inappropriate behavior': [
    'The user has been posting offensive comments repeatedly on several threads.',
    'Multiple instances of harassment in comments were observed over the past few days.',
    'This user consistently shares content that is inappropriate for the community.',
  ],
  'Impersonation': [
    "There's someone pretending to be a well-known figure and misleading other users.",
    "This profile is a fake account that impersonates another person's identity.",
  ],
  'Spamming': [
    'This account has been posting spam links in the comments section of every post.',
    'Continuous posting of promotional content that has no relevance to the discussion topics.',
    'The user is flooding the forum with multiple irrelevant links and promotional offers.',
  ],
  'Terms of service violation': [
    'This user is sharing pirated software links, which is against our terms of service.',
    'The reported account is engaging in selling illegal items, which is not allowed.',
  ],
  'Other': [
    'The user has found a loophole in the system and is exploiting it to their advantage.',
    "This is a catch-all for behavior that doesn't fit into other categories but is still concerning.",
  ],
}

// Utility function to get a random comment based on the reason
const getRandomComment = (reason: ReportProfileReasonName): string => {
  const possibleComments = commentsByReason[reason]
  return possibleComments[Math.floor(Math.random() * possibleComments.length)] ?? ''
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
  const reason = getRandomReason()
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
        name: reason,
      },
      comment: getRandomComment(reason),
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

const generateRandomUserStatusChanges = (n: number): UserStatusChange[] => {
  const userStatusChanges: UserStatusChange[] = []
  for (let i = 0; i < n; i++) {
    const randomUserStatusChange: UserStatusChange = {
      status: getRandomStatus(),
      date: new Date(getRandomDate()), // Convert the string to a Date object
      userChangedStatus: {
        displayName: names[Math.floor(Math.random() * names.length)] || '',
        email: `${Math.random().toString(36).substring(7)}@school.edu`,
        profileHref: href('Pages/Profile/Admin'),
      },
    }
    userStatusChanges.push(randomUserStatusChange)
  }
  return userStatusChanges
}

const emails = names.map((name, i) => `${name.split(' ').join('.')}${i}@school.edu`.toLowerCase())

function getRandomUser(
  deleteReports: (email: string) => void,
  changeStatus: (newStatus: UserStatus, email: string) => void,
): ModerationUser {
  const randomIndex = Math.floor(Math.random() * names.length)
  return {
    user: {
      title: names[randomIndex] || '', // Assign an empty string as the default value
      email: emails[randomIndex] || '', // Assign an empty string as the default value
      profileHref: href('Pages/Profile/Admin'),
      currentStatus: getRandomStatus(),
      reports: generateRandomUserReports(Math.floor(Math.random() * 15) + 2),
      mainReportReason: getRandomReason(),
      statusHistory: [
        {
          status: getRandomStatus(),
          date: new Date(getRandomDate()),
          userChangedStatus: {
            displayName: names[Math.floor(Math.random() * names.length)] || '',
            email: emails[randomIndex] || '',
            profileHref: href('Pages/Profile/Admin'),
          },
        },
        {
          status: getRandomStatus(),
          date: new Date(getRandomDate()),
          userChangedStatus: {
            displayName: names[Math.floor(Math.random() * names.length)] || '',
            email: emails[randomIndex] || '',
            profileHref: href('Pages/Profile/Admin'),
          },
        },
      ],
    },
    toggleIsPublisher: () => console.log('Toggling user type'),
    deleteUser: () => {
      changeStatus('Deleted', emails[randomIndex] || '')
    }, // Add the missing deleteReports property
    deleteReports: () => {
      deleteReports(emails[randomIndex] || '')
    }, // Add the missing deleteReports property
  }
}

const createRandomUsers = (
  n: number,
  deleteReports: (email: string) => void,
  changeStatus: (newStatus: UserStatus, email: string) => void,
): ReturnType<typeof getRandomUser>[] => {
  return Array.from({ length: n }, () => getRandomUser(deleteReports, changeStatus))
}

export const useModerationStoryProps = (overrides?: {
  props?: Partial<ModerationProps>
}): Omit<ModerationProps, 'search'> => {
  const [users, setUsers] = useState<ModerationUser[]>([])

  const deleteReports = useCallback((email: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.user.email !== email))
  }, [])

  const changeStatus = useCallback((newStatus: UserStatus, email: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user => {
        if (user.user.email === email) {
          return { ...user, user: { ...user.user, currentStatus: newStatus } }
        }
        return user
      }),
    )
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
                comment:
                  'The user has been posting offensive comments repeatedly on several threads.',
              },
              status: 'Non-authenticated',
            },
            ...generateRandomUserStatusChanges(Math.floor(Math.random() * 10) + 1),
          ],
          mainReportReason: 'Inappropriate behavior',
          currentStatus: getRandomStatus(),
          statusHistory: generateRandomUserStatusChanges(Math.floor(Math.random() * 10) + 1),
          ...generateRandomUserReports(Math.floor(Math.random() * 10) + 1),
        },
        toggleIsPublisher: () => console.log('Toggling user type'),
        deleteReports: () => {
          deleteReports('maria.anders@school.edu')
        },
        deleteUser: () => {
          deleteReports('maria.anders@school.edu')
        },
      },
      ...createRandomUsers(5, deleteReports, changeStatus),
    ],
    [deleteReports, changeStatus],
  )

  useEffect(() => {
    setUsers(defaultUsers)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultUsers]) // Include 'defaultUsers' as a dependency

  const sort: SortReportedUsers = {
    sortByDispalyName: () =>
      setUsers(prevUsers =>
        [...prevUsers].sort((a, b) => a.user.title.localeCompare(b.user.title)),
      ),
    sortByStatus: () =>
      setUsers(prevUsers =>
        [...prevUsers].sort((a, b) => a.user.currentStatus.localeCompare(b.user.currentStatus)),
      ),
    sortByFlags: () =>
      setUsers(prevUsers =>
        [...prevUsers].sort((a, b) => a.user.reports.length - b.user.reports.length),
      ),
    sortByLastFlag: () => {
      setUsers(prevUsers =>
        [...prevUsers].sort((a, b) => {
          const getLastReportDate = (reports: UserReport[]) =>
            new Date(
              reports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
                ?.date || 0,
            )
          return (
            getLastReportDate(b.user.reports).getTime() -
            getLastReportDate(a.user.reports).getTime()
          )
        }),
      )
    },
    sortByMainReason: () => {
      setUsers(prevUsers =>
        [...prevUsers].sort((a, b) => {
          const reasonA = a.user.mainReportReason || '' // Fallback to empty string if undefined
          const reasonB = b.user.mainReportReason || '' // Fallback to empty string if undefined
          return reasonA.localeCompare(reasonB)
        }),
      )
    },
  }

  return {
    users,
    sort,
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
      sort={useModerationStoryProps().sort}
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
