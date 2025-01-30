import type {
  d_u,
  date_time_string,
  email_address,
  ok_ko,
  signed_expire_token,
  time_duration_string,
} from '@moodle/lib-types'

import type {
  roleHistoryItem,
  userAccountId,
  userDeactivationReason,
  userIdEmailPasswordMsgSchemaConfigs,
  userRole,
} from '../../model/user-home/types'

export * from '../../model/user-home/types'

export default interface userAccountDomain {
  event: { userAccount: unknown }
  service: {
    userAccount: {
      generateUserSessionToken(_: {
        userAccountId: userAccountId
      }): Promise<ok_ko<{ userSessionToken: signed_expire_token }, { userNotFound: unknown; profileNotFound: unknown }>>
    }
  }
  primary: {
    userAccount: {
      admin: {}

      signedTokenAccess: {}

      anyUser: {
        moduleInfo(): Promise<{ schemaConfigs: userIdEmailPasswordMsgSchemaConfigs }>
      }

      unauthenticated: {}

      authenticated: {}
    }
  }
  secondary: {
    userAccount: {
      write: {
        saveNewUser(_: { newUser: userAccountRecord }): Promise<ok_ko<void>>
        setUserPassword(_: { userAccountId: userAccountId; newPasswordHash: string }): Promise<ok_ko<void>>

        deactivateUser(_: {
          userAccountId: userAccountId
          anonymize: boolean
          reason: userDeactivationReason
          overrideDeactivationDate?: date_time_string
        }): Promise<ok_ko<{ deactivatedUserAccountRecord: userAccountRecord }>>

        setUserRoles(_: {
          userAccountId: userAccountId
          roles: userRole[]
          addRoleHistoryItem: roleHistoryItem
        }): Promise<ok_ko<{ newRoles: userRole[]; oldRoles: userRole[] }>>
      }
      service?: unknown
      query: {
        activeUsersNotLoggedInFor(_: {
          time: time_duration_string
          inactiveNotificationSent: boolean
        }): Promise<{ inactiveUsers: userAccountRecord[] }>

        findUser(
          _: d_u<{ email: { email: email_address }; id: { userAccountId: userAccountId } }, 'by'>,
        ): Promise<ok_ko<userAccountRecord>>

        usersByText(_: { text: string; includeDeactivated?: boolean }): Promise<{ userAccountRecords: userAccountRecord[] }>
      }
      sync: {
        userDisplayname(_: { userAccountId: userAccountId; displayName: string }): Promise<ok_ko<void>>
      }
    }
  }
}
