import { lib_moodle_iam } from '@moodle/lib-domain'
import { time_duration_string } from '@moodle/lib-types'

export interface Configs {
  primaryMsgSchemaConfigs: lib_moodle_iam.v0_1.PrimaryMsgSchemaConfigs
  roles: {
    newlyCreatedUserRoles: lib_moodle_iam.v0_1.user_role[]
  }
  inactiveUsersPolicies: {
    deleteInactive: {
      notLoggedInFor: time_duration_string
      sendImminentDeletionNotificationBefore: time_duration_string
    }
  }
  tokenExpireTime: {
    userSession: time_duration_string
    signupEmailVerification: time_duration_string
    userSelfDeletionRequest: time_duration_string
    resetPasswordRequest: time_duration_string
  }
}
