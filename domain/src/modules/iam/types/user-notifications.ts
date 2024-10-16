import { email_address, url_string } from '@moodle/lib-types'
import { user_id } from './user'

export type inactivityBeforeDeletionNotificationData = {
  toUserId: user_id
  loginUrl: url_string
  daysBeforeDeletion: number
}

export type passwordChangedNotificationData = {
  toUserId: user_id
}

export type resetPasswordRequestNotificationData = {
  toUserId: user_id
  resetPasswordUrl: url_string
}

export type deleteAccountRequestNotificationData = {
  toUserId: user_id
  deleteAccountUrl: url_string
}

export type signupWithEmailConfirmationNotificationData = {
  signupEmail: email_address
  userName: string
  activateAccountUrl: url_string
}
