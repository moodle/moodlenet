import type { time_duration_string } from '@moodle/lib-types'
import { PrimaryMsgSchemaConfigs } from './primary-schemas'
import type { user_role } from './user'

export type v1_0 = { v: '1_0' }
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
    userSession: time_duration_string
    signupEmailVerification: time_duration_string
    userSelfDeletionRequest: time_duration_string
    resetPasswordRequest: time_duration_string
  }
}
