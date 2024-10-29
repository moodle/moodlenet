import type {
  d_u,
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
  loginForm,
  resetPasswordForm,
  signupForm,
  userAccountId,
  userAccountPrimaryMsgSchemaConfigs,
  userAccountRecord,
  userDeactivationReason,
  userRole,
  userSession,
} from './types'

export * from './types'

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
      admin: {
        editUserRoles(_: {
          userAccountId: userAccountId
          role: userRole
          action: 'set' | 'unset'
        }): Promise<ok_ko<{ updatedRoles: userRole[]; adminUserAccountId: userAccountId }, { userNotFound: unknown }>>
        searchUsers(_: { textSearch: string }): Promise<{ users: userAccountRecord[] }>
        deactivateUser(_: {
          userAccountId: userAccountId
          reason: string
          anonymize: boolean
        }): Promise<ok_ko<{ adminUserAccountId: userAccountId }, { userNotFound: unknown }>>
      }

      signedTokenAccess: {
        confirmSelfDeletionRequest(_: {
          selfDeletionConfirmationToken: signed_token
          reason: string
        }): Promise<ok_ko<void, { invalidToken: unknown; unknownUser: unknown; unknown: unknown }>>

        resetPassword(_: {
          resetPasswordForm: resetPasswordForm
        }): Promise<ok_ko<void, { invalidToken: unknown; userNotFound: unknown; unknown: unknown }>>

        createNewUserByEmailVerificationToken(_: {
          signupEmailVerificationToken: signed_token
        }): Promise<
          ok_ko<
            { userAccountId: userAccountId; userSessionToken: signed_expire_token },
            { unknown: unknown; invalidToken: unknown; userWithThisEmailExists: unknown }
          >
        >
      }

      anyUser: {
        getUserSession(): Promise<{ userSession: userSession }>
        moduleInfo(): Promise<{ schemaConfigs: userAccountPrimaryMsgSchemaConfigs }>
      }

      unauthenticated: {
        signupRequest(_: {
          signupForm: signupForm
          redirectUrl: url_string
        }): Promise<ok_ko<void, { userWithSameEmailExists: unknown }>>

        login(_: { loginForm: loginForm }): Promise<
          ok_ko<{
            sessionToken: signed_expire_token
          }>
        >

        resetPasswordRequest(_: { redirectUrl: url_string; declaredOwnEmail: email_address }): Promise<void>
      }

      authenticated: {
        invalidateSession(): Promise<{ userAccountId: userAccountId }>

        getMyUserAccountRecord(): Promise<userAccountRecord>

        selfDeletionRequest(_: { redirectUrl: url_string }): Promise<{ userAccountId: userAccountId }>

        changePassword(
          _: changePasswordForm,
        ): Promise<ok_ko<{ userAccountId: userAccountId }, { wrongCurrentPassword: unknown; unknown: unknown }>>
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
        }): Promise<ok_ko<{ deactivatedUserAccountRecord: userAccountRecord }>>

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

        usersByText(_: { text: string; includeDeactivated?: boolean }): Promise<{ userAccountRecords: userAccountRecord[] }>
      }
      sync: {
        userDisplayname(_: { userAccountId: userAccountId; displayName: string }): Promise<ok_ko<void>>
      }
    }
  }
}
