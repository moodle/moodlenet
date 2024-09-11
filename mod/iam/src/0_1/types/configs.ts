import { time_duration_string } from '@moodle/lib-types'
import { user_role } from './data'
import { PrimaryMsgSchemaConfigs } from './primary/schemas-configs'

export interface Configs {
  primaryMsgSchemaConfigs: PrimaryMsgSchemaConfigs
  roles: {
    newlyCreatedUserRoles: user_role[]
  }
  inactiveUsersPolicies: {
    deleteInactive: {
      notLoggedInFor: time_duration_string
      sendImminentDeletionNotificationBefore: time_duration_string
    }
  }
  tokenExpireTime: {
    signupEmailVerification: time_duration_string
    userSelfDeletionRequest: time_duration_string
    resetPasswordRequest: time_duration_string
  }
}
