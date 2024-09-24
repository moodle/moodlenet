import type { mod, session_token } from '@moodle/lib-ddd'
import type {
  __redacted__,
  d_u__d,
  date_time_string,
  email_address,
  signed_token,
  named_or_email_address,
  ok_ko,
  time_duration_string,
  url_string,
  signed_expire_token,
} from '@moodle/lib-types'
import type * as v1_0_org from '@moodle/mod-org/v1_0/lib'
import type { ReactElement } from 'react'

import * as v1_0 from './v1_0/types'

declare module '@moodle/lib-ddd' {
  export interface MoodleMods {
    iam: moodle_iam_mod
  }
}

export type moodle_iam_mod = mod<{
  v1_0: {
    pri: {
      session: {
        getCurrentUserSession(): Promise<{ userSession: v1_0.user_session }>
        generateUserSession(_: {
          userId: v1_0.user_id
        }): Promise<ok_ko<signed_expire_token, { userNotFound: unknown }>>
      }

      configs: {
        read(): Promise<{ iam: v1_0.Configs; org: v1_0_org.Configs }>
      }

      admin: {
        editUserRoles(_: {
          userId: v1_0.user_id
          roles: v1_0.user_role[]
        }): Promise<ok_ko<never, { userNotFound: unknown }>>
        searchUsers(_: { textSearch: string }): Promise<{ users: v1_0.userRecord[] }>
        deactivateUser(_: {
          userId: v1_0.user_id
          reason: string
          anonymize: boolean
        }): Promise<ok_ko<never, { userNotFound: unknown }>>
      }

      access: {
        request(_: {
          signupForm: v1_0.signupForm
          redirectUrl: url_string
        }): Promise<ok_ko<never, { userWithSameEmailExists: unknown }>>

        createNewUserByEmailVerificationToken(_: {
          signupEmailVerificationToken: signed_token
        }): Promise<
          ok_ko<
            { userId: v1_0.user_id },
            { /* userWithThisEmailExists: unknown; */ invalidToken: unknown; unknown: unknown }
          >
        >
        login(_: { loginForm: v1_0.loginForm }): Promise<
          ok_ko<{
            session: signed_expire_token
            authenticatedSession: d_u__d<v1_0.user_session, 'type', 'authenticated'>
          }>
        >
        logout(_: { sessionToken: session_token }): Promise<void>

        resetPasswordRequest(_: {
          redirectUrl: url_string
          declaredOwnEmail: email_address
        }): Promise<void>
      }

      myAccount: {
        selfDeletionRequest(_: { redirectUrl: url_string }): Promise<void>

        confirmSelfDeletionRequest(_: {
          selfDeletionConfirmationToken: signed_token
          reason: string
        }): Promise<ok_ko<never, { invalidToken: unknown; unknownUser: unknown; unknown: unknown }>>

        resetPassword(_: {
          resetPasswordForm: v1_0.resetPasswordForm
        }): Promise<
          ok_ko<never, { invalidToken: unknown; userNotFound: unknown; unknown: unknown }>
        >

        changePassword(
          _: v1_0.changePasswordForm,
        ): Promise<ok_ko<never, { wrongCurrentPassword: unknown; unknown: unknown }>>
      }
    }
    sec: {
      crypto: {
        hashPassword(_: {
          plainPassword: __redacted__<v1_0.user_plain_password>
        }): Promise<{ passwordHash: string }>
        verifyUserPasswordHash(_: {
          plainPassword: __redacted__<v1_0.user_plain_password>
          passwordHash: string
        }): Promise<ok_ko<never>>

        signDataToken(_: {
          data: v1_0.iamSignTokenData
          expiresIn: time_duration_string
        }): Promise<signed_expire_token>
        validateSignedToken(_: { token: session_token }): Promise<ok_ko<v1_0.iamSignTokenData>>
        //TODO: implement decodeNoValidateSignedToken(_: { token: session_token }): Promise<ok_ko<v1_0.iamSignTokenData>>
      }

      email: {
        sendNow(_: {
          to: named_or_email_address
          subject: string
          reactBody: ReactElement
        }): Promise<void>
      }

      db: {
        getConfigs(): Promise<{ iam: v1_0.Configs; org: v1_0_org.Configs }>

        changeUserPassword(_: {
          userId: v1_0.user_id
          newPasswordHash: string
        }): Promise<ok_ko<never>>

        deactivateUser(_: {
          userId: v1_0.user_id
          anonymize: boolean
          reason: v1_0.user_deactivation_reason
          at?: date_time_string
        }): Promise<ok_ko<never>>

        getActiveUsersNotLoggedInFor(_: {
          time: time_duration_string
          inactiveNotificationSent: boolean
        }): Promise<{ inactiveUsers: v1_0.userRecord[] }>

        getUserById(_: { userId: v1_0.user_id }): Promise<ok_ko<v1_0.userRecord>>
        getUserByEmail(_: { email: email_address }): Promise<ok_ko<v1_0.userRecord>>

        saveNewUser(_: { newUser: v1_0.userRecord }): Promise<ok_ko<never>>

        changeUserRoles(_: {
          userId: v1_0.user_id
          roles: v1_0.user_role[]
          adminUserId: v1_0.user_id
        }): Promise<ok_ko<never>>

        findUsersByText(_: {
          text: string
          includeDeactivated?: boolean
        }): Promise<{ users: v1_0.userRecord[] }>
      }
    }
    evt: {
      userBase: {
        userDeactivated(_: {
          user: v1_0.userRecord
          reason: v1_0.user_deactivation_reason
          anonymized: boolean
        }): unknown
        newUserCreated(_: { user: v1_0.userRecord }): unknown
      }
      userSecurity: {
        userPasswordChanged(_: { userId: v1_0.user_id }): unknown
      }
      userRoles: {
        userRolesUpdated(_: {
          userId: v1_0.user_id
          roles: v1_0.user_role[]
          oldRoles: v1_0.user_role[]
        }): unknown
      }
      userActivity: {
        userLoggedIn(_: { userId: v1_0.user_id }): unknown
      }
    }
  }
}>
