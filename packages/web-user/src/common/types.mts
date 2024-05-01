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
  date: string
  userChangedStatus: UserChangedStatus
}

export type ReportOptionTypeId =
  | 'inappropriate_behavior'
  | 'impersonation'
  | 'spamming'
  | 'terms_of_service_violation'
  | 'other'
export type ReportOptionType = {
  id: ReportOptionTypeId
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
  date: string
  user: UserReporter
  reason: ReportProfileData
}

export type ReportProfileReasonName =
  | 'Inappropriate behavior'
  | 'Impersonation'
  | 'Spamming'
  | 'Terms of service violation'
  | 'Other'

export type WebUserDataRPC = {
  _key: string
  profileKey: string
  name: string
  email: string
  isAdmin: boolean
  isPublisher: boolean
  profileHomePath: string
  reports: UserReportRPC[]
  statusHistory: UserStatusChangeRPC[]
  mainReportReason?: ReportProfileReasonName
  currentStatus: UserStatus
}
export type UserReportRPC = {
  date: string
  user: UserReporterRPC
  reason: ReportProfileData
}
export type UserReporterRPC = {
  displayName: string
  email: string
  profileKey: string
}
export type UserStatusChangeRPC = {
  status: UserStatus
  date: string
  userChangedStatus: UserReporterRPC
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

export type WhistleblowResourceReasonName =
  | 'Inappropriate content'
  | 'Copyright infringement'
  | 'Misinformation or inaccuracy'
  | 'Spam or self-promotion'
  | 'Irrelevant content'
  | 'Other'

export type WhistleblowResourceOptionType = {
  id: string
  name: WhistleblowResourceReasonName
}

export type WhistleblowUser = {
  displayName: string
  avatarUrl: string
  profileHref: Href
  email: string
}

export type WhistleblowResourceData = {
  type: WhistleblowResourceOptionType
  comment: string | undefined
  date: Date
}

export type WhistleblowResource = {
  title: string
  imageUrl: string
  resourceHref: Href
}

export type WhistleblownResourceData = WhistleblowResourceData & {
  resource: WhistleblowResource
  user: WhistleblowUser
}
export type ModerationResource = WhistleblowResource & {
  user: {
    displayName: string
    email: string
    profileHref: Href
    currentStatus: UserStatus

    statusHistory: UserStatusChange[]
  }
  whistleblows: WhistleblownResourceData[]
  mainReportReason: WhistleblowResourceReasonName
}
