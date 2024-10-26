import type {
  d_u,
  d_u__d,
  date_time_string,
  email_address,
  ok_ko,
  signed_expire_token,
  signed_token,
  time_duration_string,
  url_string,
} from '@moodle/lib-types'

import type {
  changePasswordForm,
  userAccountPrimaryMsgSchemaConfigs,
  loginForm,
  resetPasswordForm,
  signupForm,
  userDeactivationReason,
  userAccountId,
  userAccountRecord,
  userRole,
  userSession,
} from './types'

export * from './types'

export default interface userAccountDomain {
  event: { userAccount: unknown }
  primary: {
    userAccount: {
      service?: unknown
      session: {
        getUserSession(): Promise<{ userSession: userSession }>
        generateUserSessionToken(_: {
          userAccountId: userAccountId
        }): Promise<ok_ko<{ userSessionToken: signed_expire_token }, { userNotFound: unknown }>>
        moduleInfo(): Promise<{ schemaConfigs: userAccountPrimaryMsgSchemaConfigs }>
      }
      admin: {
        editUserRoles(_: {
          userAccountId: userAccountId
          role: userRole
          action: 'set' | 'unset'
        }): Promise<ok_ko<{ updatedRoles: userRole[] }, { userNotFound: unknown }>>
        searchUsers(_: { textSearch: string }): Promise<{ users: userAccountRecord[] }>
        deactivateUser(_: {
          userAccountId: userAccountId
          reason: string
          anonymize: boolean
        }): Promise<ok_ko<void, { userNotFound: unknown }>>
      }

      access: {
        signupRequest(_: {
          signupForm: signupForm
          redirectUrl: url_string
        }): Promise<ok_ko<void, { userWithSameEmailExists: unknown }>>

        createNewUserByEmailVerificationToken(_: {
          signupEmailVerificationToken: signed_token
        }): Promise<
          ok_ko<
            { userAccountId: userAccountId },
            { unknown: unknown; invalidToken: unknown /* userWithThisEmailExists: unknown; */ }
          >
        >
        login(_: { loginForm: loginForm }): Promise<
          ok_ko<{
            session: signed_expire_token
            authenticatedUser: d_u__d<userSession, 'type', 'authenticated'>
          }>
        >
        logout(_: { sessionToken: signed_token }): Promise<void>

        resetPasswordRequest(_: { redirectUrl: url_string; declaredOwnEmail: email_address }): Promise<void>
      }

      myAccount: {
        selfDeletionRequest(_: { redirectUrl: url_string }): Promise<void>

        confirmSelfDeletionRequest(_: {
          selfDeletionConfirmationToken: signed_token
          reason: string
        }): Promise<ok_ko<void, { invalidToken: unknown; unknownUser: unknown; unknown: unknown }>>

        resetPassword(_: {
          resetPasswordForm: resetPasswordForm
        }): Promise<ok_ko<void, { invalidToken: unknown; userNotFound: unknown; unknown: unknown }>>

        changePassword(_: changePasswordForm): Promise<ok_ko<void, { wrongCurrentPassword: unknown; unknown: unknown }>>
      }
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
        }): Promise<ok_ko<{ deactivatedUser: userAccountRecord }>>

        setUserRoles(_: {
          userAccountId: userAccountId
          roles: userRole[]
          adminUserAccountId: userAccountId
        }): Promise<ok_ko<{ newRoles: userRole[]; oldRoles: userRole[] }>>
      }
      service?: unknown
      // service: {
      //   hashPassword(_: { plainPassword: __redacted__<plain_password> }): Promise<{ passwordHash: string }>

      //   verifyPasswordHash(_: {
      //     plainPassword: __redacted__<plain_password>
      //     passwordHash: string
      //   }): Promise<ok_ko<void>>

      //   validateSignedToken<type extends userAccountSignTokenData['type']>(_: {
      //     token: signed_token
      //     type: type
      //   }): Promise<
      //     ok_ko<
      //       { validatedSignedTokenData: d_u__d<userAccountSignTokenData, 'type', type> },
      //       { invalid: unknown; validatedUnknownType: { data: unknown } }
      //     >
      //   >
      //   //NOTE: implement decodeNoValidateSignedToken(_: { token: session_token }): Promise<ok_ko<{__NOT_VALIDATED_SESSION_TOKEN_DATA__:userAccountSignTokenData}>>
      //   signDataToken(_: { data: userAccountSignTokenData; expiresIn: time_duration_string }): Promise<signed_expire_token>
      // }
      query: {
        activeUsersNotLoggedInFor(_: {
          time: time_duration_string
          inactiveNotificationSent: boolean
        }): Promise<{ inactiveUsers: userAccountRecord[] }>

        userBy(
          _: d_u<{ email: { email: email_address }; id: { userAccountId: userAccountId } }, 'by'>,
        ): Promise<ok_ko<userAccountRecord>>

        usersByText(_: { text: string; includeDeactivated?: boolean }): Promise<{ users: userAccountRecord[] }>
      }
      sync: {
        userDisplayname(_: { userAccountId: userAccountId; displayName: string }): Promise<ok_ko<void>>
      }
    }
  }
}
