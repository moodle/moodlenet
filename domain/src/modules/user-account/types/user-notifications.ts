import { email_address, url_string } from '@moodle/lib-types'
import { userAccountId } from './user-account-record'

export type userAccountUserNotifications = {
  // inactivityBeforeDeletion: {
  //   toUserAccountId: userAccountId
  //   loginUrl: url_string
  //   daysBeforeDeletion: number
  // }

  passwordChanged: {
    toUserAccountId: userAccountId
  }

  resetPasswordRequest: {
    toUserAccountId: userAccountId
    resetPasswordUrl: url_string
  }

  deleteAccountRequest: {
    toUserAccountId: userAccountId
    deleteAccountUrl: url_string
  }

  signupWithEmailConfirmation: {
    signupEmail: email_address
    userName: string
    activateAccountUrl: url_string
  }
}
