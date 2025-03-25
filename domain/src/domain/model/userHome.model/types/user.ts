import { date_time_string, email_address } from '@moodle/lib-types'

export type userId = string
export type userProfileInfo = {
  displayName: string
}

export type userProfile = {
  info: userProfileInfo
  avatar: moo.def.content.asset.optional
  background: moo.def.content.asset.optional
}

export type userHomeRecord = {
  userId: userId
  createdDate: date_time_string
  profile: userProfile
  email: { address: email_address }
}
