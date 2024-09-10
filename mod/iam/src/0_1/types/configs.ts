import { time_duration_string } from '@moodle/lib-types'
import { user_role } from './db/db-user'
import { PrimaryMsgSchemaConfigs } from './primary/schemas-configs'

export interface Configs {
  primaryMsgSchemaConfigs: PrimaryMsgSchemaConfigs
  signup: {
    emailConfirmationExpireTime: time_duration_string
    newlyCreatedUserRoles: user_role[]
  }
  inactiveUsersPolicies: {
    deleteInactive: {
      notLoggedInFor: time_duration_string
      sendImminentDeletionNotificationBefore: time_duration_string
    }
  }
}
