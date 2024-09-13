import { mod, session_token } from '@moodle/domain'
import { lib_moodle_iam } from '@moodle/lib-domain'
import {
  __redacted__,
  d_u,
  d_u__d,
  email_address,
  named_or_email_address,
  ok_ko,
  one_or_more_named_or_email_addresses,
  time_duration_string,
  url,
} from '@moodle/lib-types'
import { v1_0 as v1_0_org } from '@moodle/mod-org'
import { user_id } from 'lib/domain/src/moodle/iam/v1_0'
import { ReactElement } from 'react'
import { v1_0 } from './'

declare module '@moodle/domain' {
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
        }): Promise<{ userSession: lib_moodle_iam.v1_0.user_session }>
        generateSession(_: {
          userId: user_id
        }): Promise<ok_ko<lib_moodle_iam.v1_0.session, d_u<{ userNotFound: unknown }, 'reason'>>>
      }

      configs: {
        read(): Promise<{ iam: v1_0.Configs; org: v1_0_org.Configs }>
      }

      admin: {
        editUserRoles(_: {
          userId: lib_moodle_iam.v1_0.user_id
          roles: lib_moodle_iam.v1_0.user_role[]
        }): Promise<ok_ko<void, void>>
        searchUsers(_: { textSearch: string }): Promise<{ users: v1_0.DbUser[] }>
        deactivateUser(_: {
          userId: lib_moodle_iam.v1_0.user_id
          reason: string
          anonymize: boolean
        }): Promise<void>
      }

      signup: {
        request(_: {
          signupForm: lib_moodle_iam.v1_0.signupForm
          redirectUrl: url
        }): Promise<ok_ko<void, d_u<{ userWithSameEmailExists: unknown }, 'reason'>>>

        verifyEmail(_: {
          signupEmailVerificationToken: string
        }): Promise<
          ok_ko<
            { userId: lib_moodle_iam.v1_0.user_id },
            d_u<
              { /* userWithThisEmailExists: unknown; */ invalidToken: unknown; unknown: unknown },
              'reason'
            >
          >
        >
      }

      myAccount: {
        login(_: { loginForm: lib_moodle_iam.v1_0.loginForm }): Promise<
          ok_ko<
            {
              session: lib_moodle_iam.v1_0.session
              authenticatedSession: d_u__d<
                lib_moodle_iam.v1_0.user_session,
                'type',
                'authenticated'
              >
            },
            void
          >
        >

        selfDeletionRequest(_: { redirectUrl: url }): Promise<void>

        confirmSelfDeletionRequest(_: {
          selfDeletionConfirmationToken: string
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

        changePassword(_: {
          currentPassword: __redacted__<v1_0.user_plain_password>
          newPassword: __redacted__<v1_0.user_plain_password>
        }): Promise<ok_ko<void, void>>
      }
    }
    sec: {
      crypto: {
        generateUserId(): Promise<{ id: lib_moodle_iam.v1_0.user_id }>

        // validateSessionToken(_: {
        //   sessionToken: session_token
        // }): Promise<
        //   ok_ko<
        //     d_u__d<lib_moodle_iam.v1_0.user_session, 'type', 'authenticated'>,
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

        encryptSession(_: {
          data: v1_0.sessionTokenData
          expiresIn: time_duration_string
        }): Promise<lib_moodle_iam.v1_0.session>
        decryptSession(_: { token: session_token }): Promise<ok_ko<v1_0.sessionTokenData, void>>
      }

      email: {
        sendNow(_: {
          to: one_or_more_named_or_email_addresses
          sender: named_or_email_address
          subject: string
          reactBody: ReactElement
        }): Promise<void>
      }

      db: {
        getConfigs(): Promise<{ iam: v1_0.Configs; org: v1_0_org.Configs }>

        changeUserPassword(_: {
          userId: lib_moodle_iam.v1_0.user_id
          newPasswordHash: string
        }): Promise<ok_ko<void, void>>

        deactivateUser(_: {
          userId: lib_moodle_iam.v1_0.user_id
          anonymize: boolean
          for: v1_0.user_deactivation_reason
        }): Promise<ok_ko<void, void>>

        getActiveUsersNotLoggedInFor(_: {
          time: time_duration_string
          inactiveNotificationSent: boolean
        }): Promise<{ inactiveUsers: v1_0.DbUser[] }>

        getUserById(_: { userId: lib_moodle_iam.v1_0.user_id }): Promise<ok_ko<v1_0.DbUser, void>>
        getUserByEmail(_: { email: email_address }): Promise<ok_ko<v1_0.DbUser, void>>

        saveNewUser(_: { newUser: v1_0.DbUser }): Promise<ok_ko<void, void>>

        changeUserRoles(_: {
          userId: lib_moodle_iam.v1_0.user_id
          roles: lib_moodle_iam.v1_0.user_role[]
        }): Promise<ok_ko<void, void>>

        findUsersByText(_: {
          text: string
          includeDeactivated?: boolean
        }): Promise<{ users: v1_0.DbUser[] }>
      }
    }
    evt: {
      userBase: {
        userDeactivated(_: {
          user: lib_moodle_iam.v1_0.UserData
          reason: v1_0.user_deactivation_reason
          anonymized: boolean
        }): unknown
        newUserCreated(_: { user: lib_moodle_iam.v1_0.UserData }): unknown
      }
      userSecurity: {
        userPasswordChanged(_: { userId: lib_moodle_iam.v1_0.user_id }): unknown
      }
      userRoles: {
        userRolesUpdated(_: {
          userId: lib_moodle_iam.v1_0.user_id
          roles: lib_moodle_iam.v1_0.user_role[]
          oldRoles: lib_moodle_iam.v1_0.user_role[]
        }): unknown
      }
      userActivity: {
        userLoggedIn(_: { userId: lib_moodle_iam.v1_0.user_id }): unknown
      }
    }
  }
}>
