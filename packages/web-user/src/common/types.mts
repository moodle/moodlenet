import type { Href } from '@moodlenet/react-app/common'

export type WebUserEntityNames = 'Profile'
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

export type ProfileGetRpc = {
  data: Profile
  canApprove: boolean
  isPublisher: boolean
  canEdit: boolean
  canFollow: boolean
  profileHref: Href
  profileUrl: string
  numFollowers: number
  numKudos: number
  ownKnownEntities: {
    resources: { _key: string }[]
    collections: { _key: string }[]
  }
}

export type Profile = {
  _key: string
  displayName: string
  aboutMe: string
  organizationName: string | undefined
  location: string | undefined
  siteUrl: string | undefined
  backgroundUrl: string | undefined
  avatarUrl: string | undefined
}
export type User = {
  title: string
  email: string
  isAdmin: boolean
  isPublisher: boolean
  profileHref: Href
}

export type WebUserData = {
  _key: string
  profileKey: string
  name: string
  email: string
  isAdmin: boolean
  isPublisher: boolean
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
}

export type ProfileFormValues = {
  displayName: string
  aboutMe: string
  organizationName: string | undefined
  location: string | undefined
  siteUrl: string | undefined
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
  // types: string[]
  levels: string[]
  languages: string[]
}
