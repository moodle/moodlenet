import type { error4xx, mod, session_token } from '@moodle/lib-ddd'
import type {
  __redacted__,
  d_u,
  d_u__d,
  date_time_string,
  email_address,
  encrypted_token,
  named_or_email_address,
  ok_ko,
  time_duration_string,
  url,
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
        getUserSession(_: {
          sessionToken: session_token
        }): Promise<{ userSession: v1_0.user_session }>
        generateUserSession(_: {
          userId: v1_0.user_id
        }): Promise<ok_ko<v1_0.session_obj, d_u<{ userNotFound: unknown }, 'reason'>>>
      }

      configs: {
        read(): Promise<{ iam: v1_0.Configs; org: v1_0_org.Configs }>
      }

      admin: {
        editUserRoles(_: {
          userId: v1_0.user_id
          roles: v1_0.user_role[]
        }): Promise<ok_ko<void, void>>
        searchUsers(_: { textSearch: string }): Promise<{ users: v1_0.userRecord[] }>
        deactivateUser(_: {
          userId: v1_0.user_id
          reason: string
          anonymize: boolean
        }): Promise<void>
      }

      signup: {
        request(_: {
          signupForm: v1_0.signupForm
          redirectUrl: url
        }): Promise<ok_ko<void, d_u<{ userWithSameEmailExists: unknown }, 'reason'>>>

        createNewUserByEmailVerificationToken(_: {
          signupEmailVerificationToken: encrypted_token
        }): Promise<
          ok_ko<
            { userId: v1_0.user_id },
            d_u<
              { /* userWithThisEmailExists: unknown; */ invalidToken: unknown; unknown: unknown },
              'reason'
            >
          >
        >
      }

      myAccount: {
        login(_: { loginForm: v1_0.loginForm }): Promise<
          ok_ko<
            {
              session: v1_0.session_obj
              authenticatedSession: d_u__d<v1_0.user_session, 'type', 'authenticated'>
            },
            void
          >
        >

        selfDeletionRequest(_: { redirectUrl: url }): Promise<void>

        confirmSelfDeletionRequest(_: {
          selfDeletionConfirmationToken: encrypted_token
          reason: string
        }): Promise<
          ok_ko<
            void,
            d_u<{ invalidToken: unknown; unknownUser: unknown; unknown: unknown }, 'reason'>
          >
        >

        resetPasswordRequest(_: {
          redirectUrl: url
          declaredOwnEmail: email_address
        }): Promise<void>

        resetPassword(_: {
          resetPasswordForm: v1_0.resetPasswordForm
        }): Promise<
          ok_ko<
            void,
            d_u<{ invalidToken: unknown; userNotFound: unknown; unknown: unknown }, 'reason'>
          >
        >

        changePassword(
          _: v1_0.changePasswordForm,
        ): Promise<
          ok_ko<
            void,
            d_u<{ wrongCurrentPassword: unknown; unknown: unknown; error4xx: error4xx }, 'reason'>
          >
        >
      }
    }
    sec: {
      crypto: {
        // validateSessionToken(_: {
        //   sessionToken: session_token
        // }): Promise<
        //   ok_ko<
        //     d_u__d<v1_0.user_session, 'type', 'authenticated'>,
        //     d_u<{ invalid: unknown }, 'reason'>
        //   >
        // >

        // password hashing
        hashPassword(_: {
          plainPassword: __redacted__<v1_0.user_plain_password>
        }): Promise<{ passwordHash: string }>
        verifyUserPasswordHash(_: {
          plainPassword: __redacted__<v1_0.user_plain_password>
          passwordHash: string
        }): Promise<ok_ko<void, void>>
        //

        encryptTokenData(_: {
          data: v1_0.iamTokenData
          expiresIn: time_duration_string
        }): Promise<v1_0.session_obj>
        decryptTokenData(_: { token: session_token }): Promise<ok_ko<v1_0.iamTokenData, void>>
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
        }): Promise<ok_ko<void, void>>

        deactivateUser(_: {
          userId: v1_0.user_id
          anonymize: boolean
          reason: v1_0.user_deactivation_reason
          at?: date_time_string
        }): Promise<ok_ko<void, void>>

        getActiveUsersNotLoggedInFor(_: {
          time: time_duration_string
          inactiveNotificationSent: boolean
        }): Promise<{ inactiveUsers: v1_0.userRecord[] }>

        getUserById(_: { userId: v1_0.user_id }): Promise<ok_ko<v1_0.userRecord, void>>
        getUserByEmail(_: { email: email_address }): Promise<ok_ko<v1_0.userRecord, void>>

        saveNewUser(_: { newUser: v1_0.userRecord }): Promise<ok_ko<void, void>>

        changeUserRoles(_: {
          userId: v1_0.user_id
          roles: v1_0.user_role[]
        }): Promise<ok_ko<void, void>>

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
