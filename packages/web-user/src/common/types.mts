import { Href } from '@moodlenet/component-library'
import { WebUserProfile } from '../server/types.mjs'

export type User = {
  title: string
  email?: string
  isAdmin: boolean
}

export type WebUserData = {
  _key: string
  name: string
  email?: string
  isAdmin: boolean
}

export type AuthDataRpc = {
  isRoot: false
  access: { isAdmin: boolean; isAuthenticated: boolean }
  myProfile: undefined | WebUserProfile
} // | { isRoot: true }

export type ClientSessionDataRpc =
  | {
      isRoot: false
      isAdmin: boolean
      myProfile: WebUserProfile
    }
  | {
      isRoot: true
    }

export type ProfileData = {
  userId: string
  backgroundUrl: string | null
  avatarUrl: string | null
  displayName: string
  username: string
  organizationName: string
  profileHref: Href
}

export type ProfileFormValues = {
  displayName: string
  aboutMe: string
  organizationName?: string
  location?: string
  siteUrl?: string
  backgroundImage?: string | File | null
  avatarImage?: string | File | null
}

export type ProfileState = {
  // followed: boolean
}

export type ProfileActions = {
  // toggleFollow(): unknown
  editProfile(values: ProfileFormValues): void | Promise<void>
}

export type ProfileAccess = {
  isCreator: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  canEdit: boolean
}
