import { time_duration_string_schema } from '@moodle/lib-types'
import { iam } from '@moodle/domain'

export const iam_default_configs: iam.Configs = {
  iamPrimaryMsgSchemaConfigs: {
    myAccount: {
      selfDeletionRequestReason: {
        max: 300,
      },
    },
    user: {
      email: { max: 35 },
      password: { min: 8, max: 35 },
      displayName: { min: 3, max: 35, regex: null },
    },
  },
  inactiveUsersPolicies: {
    deleteInactive: {
      notLoggedInFor: time_duration_string_schema.parse('P1Y'),
      sendImminentDeletionNotificationBefore: time_duration_string_schema.parse('P7D'),
    },
  },
  roles: {
    newlyCreatedUserRoles: [],
  },
  tokenExpireTime: {
    userSession: time_duration_string_schema.parse('P2D'),
    resetPasswordRequest: time_duration_string_schema.parse('PT2H'),
    signupEmailVerification: time_duration_string_schema.parse('PT2H'),
    userSelfDeletionRequest: time_duration_string_schema.parse('PT1H'),
  },
}
