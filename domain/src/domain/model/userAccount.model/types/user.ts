import { date_time_string, email_address } from '@moodle/lib-types'

export type userId = string
export type userProfileInfo = {
  displayName: string
}

export type userProfile = {
  info: userProfileInfo
  avatar: moo.content.asset.optional
  background: moo.content.asset.optional
}

export type userAccountRecord = {
  userId: userId
  createdDate: date_time_string
  profile: userProfile
  email: { address: email_address }
  password: { hash: string }
}
