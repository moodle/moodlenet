import { email_address, url_string } from '@moodle/lib-types'
import { user_id } from './user'

export type iamUserNotifications = {
  // inactivityBeforeDeletion: {
  //   toUserId: user_id
  //   loginUrl: url_string
  //   daysBeforeDeletion: number
  // }

  passwordChanged: {
    toUserId: user_id
  }

  resetPasswordRequest: {
    toUserId: user_id
    resetPasswordUrl: url_string
  }

  deleteAccountRequest: {
    toUserId: user_id
    deleteAccountUrl: url_string
  }

  signupWithEmailConfirmation: {
    signupEmail: email_address
    userName: string
    activateAccountUrl: url_string
  }
}
