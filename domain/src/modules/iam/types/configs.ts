import type { time_duration_string } from '@moodle/lib-types'
import { IamPrimaryMsgSchemaConfigs } from './primary-schemas'
import type { user_role } from './user'

export interface Configs {
  iamPrimaryMsgSchemaConfigs: IamPrimaryMsgSchemaConfigs
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
    userSession: time_duration_string
    signupEmailVerification: time_duration_string
    userSelfDeletionRequest: time_duration_string
    resetPasswordRequest: time_duration_string
  }
}
