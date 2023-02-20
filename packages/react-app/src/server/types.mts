import { AppearanceData } from './types.mjs'

export * from '../common/types.mjs'

export type WebUserProfileDataType = {
  displayName: string
  aboutMe: string
  organizationName?: string
  location?: string
  siteUrl?: string
}

export type WebUserProfile = WebUserProfileDataType & { _key: string }

export type WebUserDataType = {
  displayName: string
  contacts: Contacts
  isAdmin: boolean
  userKey: string
  profileKey: string
}

export type Contacts = {
  email?: string
}

export type CreateRequest = Pick<WebUserDataType, 'contacts' | 'isAdmin' | 'userKey'> &
  WebUserProfileDataType

export type KeyValueData = { appearanceData: AppearanceData }
