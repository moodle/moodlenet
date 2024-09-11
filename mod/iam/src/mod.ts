import { mod, primary_session, session_token } from '@moodle/domain'
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
import { loginForm, signupForm, v0_1 } from './'
import { UserData } from './0_1/types/data/user'
import {
  DbUser,
  user_deactivation_reason,
  user_id,
  user_plain_password,
  user_role,
} from './0_1/types/db/db-user'
import { encryptedTokenData } from './0_1/types/encrypted'
declare module '@moodle/domain' {
  export interface MoodleMods {
    iam: moodle_iam_mod
  }
}
export type _redacted_loginForm = Pick<loginForm, 'email'> & {
  password: __redacted__<user_plain_password>
}
export type _redacted_signupForm = Pick<signupForm, 'email' | 'displayName'> & {
  password: __redacted__<user_plain_password>
}

export type moodle_iam_mod = mod<{
  v0_1: {
    pri: {
      session: {
        getCurrentUserSession(): Promise<{ userSession: v0_1.user_session }>
      }

      configs: {
        read(): Promise<{ iam: v0_1.Configs; org: v0_1_org.Configs }>
      }

      admin: {
        editUserRoles(_: { userId: user_id; roles: user_role[] }): Promise<ok_ko<void, void>>

        searchUsers(_: { textSearch: string }): Promise<{ users: DbUser[] }>

        deactivateUser(_: { userId: user_id; reason: string; anonymize: boolean }): Promise<void>
      }

      signup: {
        apply(_: {
          signupForm: _redacted_signupForm
        }): Promise<ok_ko<void, d_u<{ userWithSameEmailExists: unknown }, 'reason'>>>

        verifyEmail(_: {
          signupEmailVerificationToken: string
        }): Promise<
          ok_ko<
            { userId: user_id },
            d_u<
              { userWithThisEmailExists: unknown; invalidToken: unknown; unknown: unknown },
              'reason'
            >
          >
        >
      }

      myAccount: {
        login(_: {
          loginForm: _redacted_loginForm
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
          currentPassword: __redacted__<user_plain_password>
          newPassword: __redacted__<user_plain_password>
        }): Promise<ok_ko<void, void>>
      }
    }
    sec: {
      crypto: {
        generateUserId(): Promise<{ id: user_id }>
        verifyUserSession(
          _: session_token | primary_session,
        ): Promise<ok_ko<{ userSession: v0_1.user_session }, void>>
        assertUserSession(
          _: session_token | primary_session,
        ): Promise<d_u__d<v0_1.user_session, 'type', 'authenticated'>>

        // password hashing
        hashPassword(_: {
          plainPassword: __redacted__<user_plain_password>
        }): Promise<{ passwordHash: string }>
        verifyUserPasswordHash(_: {
          plainPassword: __redacted__<user_plain_password>
          passwordHash: string
        }): Promise<ok_ko<void, void>>
        //

        // SignupEmailVerificationToken
        encryptSignupEmailVerificationToken(_: {
          data: d_u__d<encryptedTokenData, 'v0_1', 'signupEmailVerification'>
          expires: time_duration_string
        }): Promise<{ encrypted: string }>
        decryptSignupEmailVerificationToken(_: {
          signupEmailVerificationToken: string
        }): Promise<ok_ko<encryptedTokenData, void>>
        //

        // PasswordResetToken
        encryptResetPasswordRequestToken(_: {
          data: d_u__d<encryptedTokenData, 'v0_1', 'passwordReset'>
          expires: time_duration_string
        }): Promise<{ encrypted: string }>
        decryptResetPasswordRequestToken(_: {
          resetPasswordToken: string
        }): Promise<ok_ko<encryptedTokenData, void>>
        //

        // SelfDeletionConfirmationToken
        encryptSelfDeletionRequestConfirmationToken(_: {
          data: d_u__d<encryptedTokenData, 'v0_1', 'selfDeletionConfirm'>
          expires: time_duration_string
        }): Promise<{ encrypted: string }>
        decryptSelfDeletionRequestConfirmationToken(_: {
          selfDeletionConfirmationToken: string
        }): Promise<ok_ko<encryptedTokenData, void>>
        //
      }

      queue: {
        sendEmail(_: { to: email_address; subject: string; body: ReactElement }): Promise<void>
      }

      db: {
        getConfigs(): Promise<{ iam: v0_1.Configs; org: v0_1_org.Configs }>

        changeUserPassword(_: { userId: user_id; newPasswordHash: string }): Promise<void>

        deactivateUser(_: {
          userId: user_id
          anonymize: boolean
          for: user_deactivation_reason
        }): Promise<ok_ko<void, void>>

        getActiveUsersNotLoggedInFor(_: {
          time: time_duration_string
          inactiveNotificationSent: boolean
        }): Promise<{ inactiveUsers: DbUser[] }>

        getUserById(_: { userId: user_id }): Promise<ok_ko<DbUser, void>>
        getUserByEmail(_: { email: email_address }): Promise<ok_ko<DbUser, void>>

        saveNewUser(_: { user: DbUser }): Promise<ok_ko<void, void>>

        changeUserRoles(_: { userId: user_id; roles: user_role[] }): Promise<ok_ko<void, void>>

        findUsersByText(_: {
          text: string
          includeDeactivated?: boolean
        }): Promise<{ users: DbUser[] }>
      }
    }
    evt: {
      userBase: {
        userDeactivated(_: {
          user: UserData
          reason: user_deactivation_reason
          anonymized: boolean
        }): unknown
        newUserCreated(_: { user: UserData }): unknown
      }
      userSecurity: {
        userPasswordChanged(_: { userId: user_id }): unknown
      }
      userRoles: {
        userRolesUpdated(_: { userId: user_id; roles: user_role[]; oldRoles: user_role[] }): unknown
      }
      userActivity: {
        userLoggedIn(_: { userId: user_id }): unknown
      }
    }
  }
}>
