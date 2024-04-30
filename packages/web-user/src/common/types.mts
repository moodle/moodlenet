import type { Href } from '@moodlenet/react-app/common'

export type WebUserEntityNames = 'Profile' | 'EntityPoints'
export type KnownEntityFeature = 'bookmark' | 'follow' | 'like'
export type KnownEntityType = 'resource' | 'collection' | 'profile' | 'subject'

export type ProfileSearchResultRpc = {
  endCursor?: string
  list: { _key: string }[]
}
export type SortTypeRpc = 'Relevant' | 'Popular' | 'Recent'
export function isSortTypeRpc(_: any): _ is SortTypeRpc {
  return ['Relevant', 'Popular', 'Recent'].includes(_)
}

export type KnownFeaturedEntities = {
  [feat in KnownEntityFeature]: {
    [entType in KnownEntityType]: { _key: string }[]
  }
}
export type LeaderBoardContributor = Pick<
  ProfileData,
  'displayName' | 'avatarUrl' | 'profileHref' | 'points'
> /*  & {
  subject: string
} */

export type ProfileGetRpc = {
  data: Profile
  canApprove: boolean
  isPublisher: boolean
  canEdit: boolean
  canFollow: boolean
  profileHref: Href
  profileUrl: string
  numFollowers: number
  points: number
  numFollowing: number
  ownKnownEntities: {
    resources: { _key: string }[]
    collections: { _key: string }[]
  }
}

export type Profile = {
  _key: string
  displayName: string
  aboutMe: string
  organizationName: string | undefined | null
  location: string | undefined | null
  siteUrl: string | undefined | null
  backgroundUrl: string | undefined | null
  avatarUrl: string | undefined | null
}
export type User = {
  isAdmin: boolean
  isPublisher: boolean
  title: string
  email: string
  currentStatus: UserStatus
  profileHref: Href
  reports: UserReport[]
  statusHistory: UserStatusChange[]
  mainReportReason?: ReportProfileReasonName
}

export type UserStatus = 'Non-authenticated' | 'Non-publisher' | 'Admin' | 'Publisher' | 'Deleted'

export type UserStatusChange = {
  status: UserStatus
  date: Date
  userChangedStatus: UserChangedStatus
}

export type ReportOptionType = {
  id: string
  name: ReportProfileReasonName
}

export type ReportProfileData = {
  type: ReportOptionType
  comment: string | undefined
}

export type UserReporter = {
  displayName: string
  email: string
  profileHref: Href
}
export type UserChangedStatus = UserReporter

export type UserReport = {
  date: Date
  user: UserReporter
  reason: ReportProfileData
  status: UserStatus
}

export type ReportProfileReasonName =
  | 'Inappropriate behavior'
  | 'Impersonation'
  | 'Spamming'
  | 'Terms of service violation'
  | 'Other'

export type WebUserData = {
  _key: string
  profileKey: string
  name: string
  email: string
  isAdmin: boolean
  isPublisher: boolean
  profileHomePath: string
  reports: UserReport[]
  statusHistory: UserStatusChange[]
  mainReportReason?: ReportProfileReasonName
  currentStatus: UserStatus
}

export type AuthDataRpc = {
  isRoot: false
  access: { isAdmin: boolean; isAuthenticated: boolean }
  myProfile: undefined | Profile
}

export type ClientSessionDataRpc =
  | {
      isRoot: false
      isAdmin: boolean
      myProfile: Profile & { publisher: boolean; webUserKey: string }
    }
  | {
      isRoot: true
    }

export type ProfileData = {
  userId: string
  backgroundUrl: string | undefined
  avatarUrl: string | undefined
  displayName: string
  profileHref: Href
  points: number
  reportOptions: ReportOptionType[]
}

export type ProfileFormValues = {
  displayName: string
  aboutMe: string
  organizationName: string | undefined | null | null | null | null | null
  location: string | undefined | null | null | null | null | null
  siteUrl: string | undefined | null | null | null | null | null
}

export type ProfileState = {
  profileUrl: string
  followed: boolean
  numFollowers: number
  isPublisher: boolean
  showAccountApprovedSuccessAlert: boolean
  // isElegibleForApproval: boolean
  // isWaitingApproval: boolean
  // showApprovalRequestedSuccessAlert: boolean
}

export type ProfileActions = {
  toggleFollow(): void
  reportProfile(values: ReportProfileData): void
  editProfile(values: ProfileFormValues): void
  sendMessage(msg: string): void
  setAvatar(file: File | undefined | null): void
  setBackground: (file: File | undefined | null) => void
  // requestApproval: () => void
  approveUser: () => void
  unapproveUser: () => void
}

export type ProfileAccess = {
  isCreator: boolean
  isPublisher: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  canEdit: boolean
  canFollow: boolean
  canApprove: boolean
}

export type LMSSettingsRpc = {
  defaultInstanceDomain?: string
}

export type UserInterests = {
  subjects: string[]
  licenses: string[]
  levels: string[]
  languages: string[]
}
