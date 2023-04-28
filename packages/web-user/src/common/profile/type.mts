import { ProfileData } from '../types.mjs'

export type ProfileCardData = ProfileData & {
  displayName: string
}

// export type ProfileData = {
//   userId: string
//   backgroundUrl: string | null
//   avatarUrl: string | null
//   displayName: string
//   username: string
//   organizationName: string
//   profileHref: Href
// }

// export type ProfileFormValues = {
//   displayName: string
//   aboutMe: string
//   organizationName?: string
//   location?: string
//   siteUrl?: string
//   backgroundImage?: string | File | null
//   avatarImage?: string | File | null
// }

// export type ProfileState = {
//   followed: boolean
// }

// export type ProfileActions = {
//   toggleFollow(): unknown
//   editProfile(values: ProfileFormValues): void | Promise<void>
// }

// export type ProfileAccess = {
//   isCreator: boolean
//   isAuthenticated: boolean
//   isAdmin: boolean
//   canEdit: boolean
// }
