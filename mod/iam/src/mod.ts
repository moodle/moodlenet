import { mod } from '@moodle/domain'
import { loginForm, signupForm, v0_1 } from './'
import {
  __redacted__,
  d_u,
  date_time_string,
  email_address,
  successFail,
  time_duration_string,
} from '@moodle/lib-types'
import { DbUser, id_or_email, user_id, user_role } from './0_1/types/db/db-user'
import { User } from './0_1/types/data/user'
import { user_plain_password, user_deletion_reason } from './0_1/types/db/db-user'
import { ReactElement } from 'react'
declare module '@moodle/domain' {
  export interface MoodleMods {
    iam: moodle_iam_mod
  }
}

type _redacted_loginForm = Pick<loginForm, 'email'> & {
  password: __redacted__<user_plain_password>
}
type _redacted_signupForm = Pick<signupForm, 'email' | 'displayName'> & {
  password: __redacted__<user_plain_password>
}
export type moodle_iam_mod = mod<{
  v0_1: {
    pri: {
      configs: {
        read(): Promise<{ configs: v0_1.Configs }>
      }
      session: {
        getCurrent(): Promise<{ user: v0_1.user_session }>
      }
      admin: {
        editUserRoles(_: {
          userId: user_id
          roles: user_role[]
        }): Promise<successFail<unknown, unknown>>
        searchUsers(_: { textSearch: string }): Promise<{ users: DbUser[] }>
        deleteUser(_: { userId: user_id; summary: string }): never
      }
      signup: {
        request(_: {
          signupForm: _redacted_signupForm
        }): Promise<successFail<unknown, d_u<{ emailExists: unknown }, 'reason'>>>
        confirmEmail(_: { emailConfirmationToken: string }): Promise<successFail<unknown, unknown>>
      }
      myAccount: {
        login(_: {
          loginForm: _redacted_loginForm
        }): Promise<successFail<{ session: v0_1.user_session }, unknown>>
        selfDeletionRequest(): never
        confirmSelfDeletionRequest(_: {
          selfDeletionConfirmationToken: string
          reason: string
        }): never
        resetPasswordRequest(_: { email: email_address }): never
        changePassword(_: {
          currentPassword: __redacted__<user_plain_password>
          newPassword: __redacted__<user_plain_password>
        }): Promise<successFail<unknown, unknown>>
      }
    }
    sec: {
      userAccount: {
        verifyUserPassword(_: {
          idOrEmail: id_or_email
          password: __redacted__<user_plain_password>
        }): Promise<successFail<unknown, unknown>>
        changeUserPassword(_: {
          idOrEmail: id_or_email
          newPassword: __redacted__<user_plain_password>
        }): never
        sendPasswordResetEmail(_: { idOrEmail: id_or_email; email: ReactElement }): never
        verifyPasswordResetToken(_: {
          passwordResetToken: string
        }): Promise<successFail<{ user: DbUser }, unknown>>
        sendSelfDeletionConfirmationEmail(_: { idOrEmail: id_or_email; email: ReactElement }): never
        verifySelfDeletionConfirmationToken(_: {
          selfDeletionConfirmationToken: string
        }): Promise<successFail<{ user: DbUser }, unknown>>
        sendGoodbyeEmail(_: { idOrEmail: id_or_email; email: ReactElement }): never
      }
      signup: {
        sendConfirmationEmail(_: {
          signupForm: _redacted_signupForm
          expireDate: time_duration_string
          email: ReactElement
        }): never
        validateConfirmationToken(_: {
          emailConfirmationToken: string
        }): Promise<successFail<{ signupForm: _redacted_signupForm }, unknown>>
      }
      inactivityPolicies: {
        sendImminentDeletionNotification(_: { idOrEmail: id_or_email; email: ReactElement }): never
        deleteUser(_: {
          user: DbUser
          reason: user_deletion_reason
        }): Promise<successFail<unknown, unknown>>
        getUsersNotLoggedInFor(_: {
          time: time_duration_string
          inactiveNotificationSent: boolean
        }): Promise<{ inactiveUsers: DbUser[] }>
      }
      db: {
        getConfigs(): Promise<{ configs: v0_1.Configs }>
        getUserByIdOrEmail(_: {
          idOrEmail: id_or_email
        }): Promise<successFail<{ user: DbUser }, unknown>>
        saveNewUser(_: {
          user: User
          password: __redacted__<user_plain_password>
        }): Promise<successFail<unknown, unknown>>
        changeUserPassword(_: { newPassword: __redacted__<user_plain_password> }): never
      }
    }
    evt: never
  }
}>
