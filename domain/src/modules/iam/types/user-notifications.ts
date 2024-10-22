import { email_address, url_string } from '@moodle/lib-types'
import { userId } from './user'

export type iamUserNotifications = {
  // inactivityBeforeDeletion: {
  //   toUserId: userId
  //   loginUrl: url_string
  //   daysBeforeDeletion: number
  // }

  passwordChanged: {
    toUserId: userId
  }

  resetPasswordRequest: {
    toUserId: userId
    resetPasswordUrl: url_string
  }

  deleteAccountRequest: {
    toUserId: userId
    deleteAccountUrl: url_string
  }

  signupWithEmailConfirmation: {
    signupEmail: email_address
    userName: string
    activateAccountUrl: url_string
  }
}
