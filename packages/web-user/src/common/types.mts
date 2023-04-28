import { Href } from '@moodlenet/react-app/common'
import { WebUserProfile } from '../server/types.mjs'

export type User = {
  title: string
  email: string
  isAdmin: boolean
}

export type WebUserData = {
  _key: string
  name: string
  email: string
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
  backgroundUrl: string | null | undefined
  avatarUrl: string | null | undefined
  username: string
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
}

export type ProfileActions = {
  toggleFollow(): void
  editProfile(values: ProfileFormValues): void
  sendMessage(msg: string): void
  setAvatarImage(file: File): void
  setBackgroundImage: (file: File) => void
}

export type ProfileAccess = {
  isCreator: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  canEdit: boolean
  canFollow: boolean
}
