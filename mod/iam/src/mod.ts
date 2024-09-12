import { mod, primary_session, session_token, status4xx } from '@moodle/domain'
import {
  __redacted__,
  d_u,
  d_u__d,
  email_address,
  ok_ko,
  time_duration_string,
} from '@moodle/lib-types'
import { v0_1 as v0_1_org } from '@moodle/mod-org'
import { ReactElement } from 'react'
import { v0_1 } from './'
import { UserData } from './0_1/types/data/user'

declare module '@moodle/domain' {
  export interface MoodleMods {
    iam: moodle_iam_mod
  }
}

export type moodle_iam_mod = mod<{
  v0_1: {
    pri: {
      session: {
        getCurrentUserSession(): Promise<{ userSession: v0_1.user_session }>
      }

      configs: {
        read(): Promise<{ me: v0_1.Configs; org: v0_1_org.Configs }>
      }

      admin: {
        editUserRoles(_: {
          userId: v0_1.user_id
          roles: v0_1.user_role[]
        }): Promise<ok_ko<void, void>>
        searchUsers(_: { textSearch: string }): Promise<{ users: v0_1.DbUser[] }>
        deactivateUser(_: {
          userId: v0_1.user_id
          reason: string
          anonymize: boolean
        }): Promise<void>
      }

      signup: {
        apply(_: {
          signupForm: v0_1.libjs.signupForm
        }): Promise<ok_ko<void, d_u<{ userWithSameEmailExists: unknown }, 'reason'>>>

        verifyEmail(_: {
          signupEmailVerificationToken: string
        }): Promise<
          ok_ko<
            { userId: v0_1.user_id },
            d_u<
              { userWithThisEmailExists: unknown; invalidToken: unknown; unknown: unknown },
              'reason'
            >
          >
        >
      }

      myAccount: {
        login(_: {
          loginForm: v0_1.libjs.loginForm
        }): Promise<ok_ko<{ session: v0_1.user_session }, void>>

        selfDeletionRequest(): Promise<void>

        confirmSelfDeletionRequest(_: {
          selfDeletionConfirmationToken: string
          reason: string
        }): Promise<
          ok_ko<
            void,
            d_u<{ invalidToken: unknown; unknownUser: unknown; unknown: unknown }, 'reason'>
          >
        >

        resetPasswordRequest(_: { declaredOwnEmail: email_address }): Promise<void>

        changePassword(_: {
          currentPassword: __redacted__<v0_1.user_plain_password>
          newPassword: __redacted__<v0_1.user_plain_password>
        }): Promise<ok_ko<void, void>>
      }
    }
    sec: {
      crypto: {
        generateUserId(): Promise<{ id: v0_1.user_id }>

        getUserSession(_: {
          token_or_session: session_token | primary_session
        }): Promise<{ userSession: v0_1.user_session }>
        assertAuthenticatedUserSession(_: {
          token_or_session: session_token | primary_session
          onFail?: { code_or_desc: status4xx; details?: string }
        }): Promise<d_u__d<v0_1.user_session, 'type', 'authenticated'>>

        // password hashing
        hashPassword(_: {
          plainPassword: __redacted__<v0_1.user_plain_password>
        }): Promise<{ passwordHash: string }>
        verifyUserPasswordHash(_: {
          plainPassword: __redacted__<v0_1.user_plain_password>
          passwordHash: string
        }): Promise<ok_ko<void, void>>
        //

        encryptToken(_: {
          data: v0_1.encryptedTokenData
          expires: time_duration_string
        }): Promise<{ encrypted: string }>
        decryptToken(_: { token: string }): Promise<ok_ko<v0_1.encryptedTokenData, void>>
      }

      email: {
        enqueue(_: { to: email_address; subject: string; body: ReactElement }): Promise<void>
      }

      db: {
        getConfigs(): Promise<{ me: v0_1.Configs; org: v0_1_org.Configs }>

        changeUserPassword(_: {
          userId: v0_1.user_id
          newPasswordHash: string
        }): Promise<ok_ko<void, void>>

        deactivateUser(_: {
          userId: v0_1.user_id
          anonymize: boolean
          for: v0_1.user_deactivation_reason
        }): Promise<ok_ko<void, void>>

        getActiveUsersNotLoggedInFor(_: {
          time: time_duration_string
          inactiveNotificationSent: boolean
        }): Promise<{ inactiveUsers: v0_1.DbUser[] }>

        getUserById(_: { userId: v0_1.user_id }): Promise<ok_ko<v0_1.DbUser, void>>
        getUserByEmail(_: { email: email_address }): Promise<ok_ko<v0_1.DbUser, void>>

        saveNewUser(_: { newUser: v0_1.DbUser }): Promise<ok_ko<void, void>>

        changeUserRoles(_: {
          userId: v0_1.user_id
          roles: v0_1.user_role[]
        }): Promise<ok_ko<void, void>>

        findUsersByText(_: {
          text: string
          includeDeactivated?: boolean
        }): Promise<{ users: v0_1.DbUser[] }>
      }
    }
    evt: {
      userBase: {
        userDeactivated(_: {
          user: UserData
          reason: v0_1.user_deactivation_reason
          anonymized: boolean
        }): unknown
        newUserCreated(_: { user: UserData }): unknown
      }
      userSecurity: {
        userPasswordChanged(_: { userId: v0_1.user_id }): unknown
      }
      userRoles: {
        userRolesUpdated(_: {
          userId: v0_1.user_id
          roles: v0_1.user_role[]
          oldRoles: v0_1.user_role[]
        }): unknown
      }
      userActivity: {
        userLoggedIn(_: { userId: v0_1.user_id }): unknown
      }
    }
  }
}>
