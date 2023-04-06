import { BaseStyleType, Href } from '@moodlenet/component-library'
import type { PackageInfo, PkgExpose, PkgIdentifier } from '@moodlenet/core'
import { CSSProperties } from 'react'
import { WebUserProfile } from '../server/types.mjs'

export type WebPkgDeps = {
  [k in string]: PkgExpose
}

export type WebappPluginDef<
  Deps extends WebPkgDeps | Record<string, never> = Record<string, never>,
> = {
  mainComponentLoc: string[]
  deps: Deps
}

export type WebappPluginItem<Deps extends WebPkgDeps = WebPkgDeps> = WebappPluginDef<Deps> & {
  guestPkgInfo: PackageInfo
  guestPkgId: PkgIdentifier
}

export type CustomStyleType = BaseStyleType & CSSProperties
export type AppearanceData = {
  logo: string
  smallLogo: string
  color: string
  //TODO //@BRU //TODO //@ETTO decide if having this as optional
  customStyle?: CustomStyleType
}

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

export type AssetInfo = {
  location: string | File
  credits?: Credits | null
}

export type Credits = {
  owner: { url: string; name: string }
  provider?: { name: string; url: string }
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
  editProfile(values: ProfileFormValues): void | Promise<any>
}

export type ProfileAccess = {
  isCreator: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  canEdit: boolean
}
