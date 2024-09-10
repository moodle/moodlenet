import { mod } from '@moodle/domain'
import { loginForm, signupForm, v0_1 } from './'
import {
  __redacted__,
  d_u__d,
  d_u,
  email_address,
  successFail,
  time_duration_string,
} from '@moodle/lib-types'
import { DbUser, id_or_email, user_id, user_role } from './0_1/types/db/db-user'
import { User } from './0_1/types/data/user'
import { user_plain_password, user_deletion_reason } from './0_1/types/db/db-user'
import { ReactElement } from 'react'
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
      configs: {
        read(): Promise<{ configs: v0_1.Configs }>
      }

      // each apps manages its own session (e.g. moodlenet nextjs app has JWT session)
      // session: {
      //   getCurrent(): Promise<{ user: v0_1.user_session }>
      // }

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
      crypto: {
        generateUserId(): Promise<{ id: user_id }>

        // password hashing
        hashPassword(_: { password: __redacted__<user_plain_password> }): Promise<{ hash: string }>
        verifyUserPasswordHash(_: {
          password: __redacted__<user_plain_password>
          passwordHash: string
        }): Promise<successFail<unknown, unknown>>
        //

        // SignupEmailVerificationToken
        encryptSignupEmailVerificationToken(_: {
          data: d_u__d<encryptedTokenData, 'type_0_1', 'signupEmailVerification'>
          expires: time_duration_string
        }): Promise<{ encrypted: string }>
        decryptSignupEmailVerificationToken(_: {
          signupEmailVerificationToken: string
        }): Promise<successFail<encryptedTokenData, unknown>>
        //

        // PasswordResetToken
        encryptPasswordResetToken(_: {
          data: d_u__d<encryptedTokenData, 'type_0_1', 'passwordReset'>
          expires: time_duration_string
        }): Promise<{ encrypted: string }>
        decryptPasswordResetToken(_: {
          passwordResetToken: string
        }): Promise<successFail<encryptedTokenData, unknown>>
        //

        // SelfDeletionConfirmationToken
        encryptSelfDeletionConfirmationToken(_: {
          data: d_u__d<encryptedTokenData, 'type_0_1', 'selfDeletionConfirm'>
          expires: time_duration_string
        }): Promise<{ encrypted: string }>
        decryptSelfDeletionConfirmationToken(_: {
          selfDeletionConfirmationToken: string
        }): Promise<successFail<encryptedTokenData, unknown>>
        //
      }

      queue: {
        sendEmail(_: { to: email_address; body: ReactElement }): never
      }

      db: {
        changeUserPassword(_: { idOrEmail: id_or_email; newPasswordHash: string }): never

        deleteUser(_: {
          userId: user_id
          reason: user_deletion_reason
        }): Promise<successFail<unknown, unknown>>

        getUsersNotLoggedInFor(_: {
          time: time_duration_string
          inactiveNotificationSent: boolean
        }): Promise<{ inactiveUsers: DbUser[] }>

        getConfigs(): Promise<{ configs: v0_1.Configs }>

        getUserByIdOrEmail(_: {
          idOrEmail: id_or_email
        }): Promise<successFail<{ user: DbUser }, unknown>>

        saveNewUser(_: {
          user: DbUser
          password: __redacted__<user_plain_password>
        }): Promise<successFail<unknown, unknown>>
      }
    }
    evt: {
      db: {
        userPasswordChanged(_: { userId: user_id }): void

        userDeleted(_: { user: User; reason: user_deletion_reason }): void

        newUserCreated(_: { user: User }): void
      }
    }
  }
}>

