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
  IamPrimaryMsgSchemaConfigs,
  loginForm,
  resetPasswordForm,
  signupForm,
  user_deactivation_reason,
  user_id,
  userRecord,
  user_role,
  userSession,
} from './types'

export * from './types'

export default interface IamDomain {
  event: { iam: unknown }
  primary: {
    iam: {
      session: {
        getUserSession(): Promise<{ userSession: userSession }>
        generateUserSessionToken(_: {
          userId: user_id
        }): Promise<ok_ko<{ userSessionToken: signed_expire_token }, { userNotFound: unknown }>>
        moduleInfo(): Promise<{ schemaConfigs: IamPrimaryMsgSchemaConfigs }>
      }

      admin: {
        editUserRoles(_: {
          userId: user_id
          role: user_role
          action: 'set' | 'unset'
        }): Promise<ok_ko<{ updatedRoles: user_role[] }, { userNotFound: unknown }>>
        searchUsers(_: { textSearch: string }): Promise<{ users: userRecord[] }>
        deactivateUser(_: {
          userId: user_id
          reason: string
          anonymize: boolean
        }): Promise<ok_ko<void, { userNotFound: unknown }>>
      }

      access: {
        signupRequest(_: {
          signupForm: signupForm
          redirectUrl: url_string
        }): Promise<ok_ko<void, { userWithSameEmailExists: unknown }>>

        createNewUserByEmailVerificationToken(_: { signupEmailVerificationToken: signed_token }): Promise<
          ok_ko<
            { userId: user_id },
            {
              /* userWithThisEmailExists: unknown; */ invalidToken: unknown
              unknown: unknown
            }
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
    iam: {
      queue: unknown
      write: {
        saveNewUser(_: { newUser: userRecord }): Promise<ok_ko<void>>
        setUserPassword(_: { userId: user_id; newPasswordHash: string }): Promise<ok_ko<void>>

        deactivateUser(_: {
          userId: user_id
          anonymize: boolean
          reason: user_deactivation_reason
          at?: date_time_string
        }): Promise<ok_ko<{ deactivatedUser: userRecord }>>

        setUserRoles(_: {
          userId: user_id
          roles: user_role[]
          adminUserId: user_id
        }): Promise<ok_ko<{ newRoles: user_role[]; oldRoles: user_role[] }>>
      }
      service: unknown
      // service: {
      //   hashPassword(_: { plainPassword: __redacted__<plain_password> }): Promise<{ passwordHash: string }>

      //   verifyPasswordHash(_: {
      //     plainPassword: __redacted__<plain_password>
      //     passwordHash: string
      //   }): Promise<ok_ko<void>>

      //   validateSignedToken<type extends iamSignTokenData['type']>(_: {
      //     token: signed_token
      //     type: type
      //   }): Promise<
      //     ok_ko<
      //       { validatedSignedTokenData: d_u__d<iamSignTokenData, 'type', type> },
      //       { invalid: unknown; validatedUnknownType: { data: unknown } }
      //     >
      //   >
      //   //NOTE: implement decodeNoValidateSignedToken(_: { token: session_token }): Promise<ok_ko<{__NOT_VALIDATED_SESSION_TOKEN_DATA__:iamSignTokenData}>>
      //   signDataToken(_: { data: iamSignTokenData; expiresIn: time_duration_string }): Promise<signed_expire_token>
      // }
      query: {
        activeUsersNotLoggedInFor(_: {
          time: time_duration_string
          inactiveNotificationSent: boolean
        }): Promise<{ inactiveUsers: userRecord[] }>

        userBy(_: d_u<{ email: { email: email_address }; id: { userId: user_id } }, 'by'>): Promise<ok_ko<userRecord>>

        usersByText(_: { text: string; includeDeactivated?: boolean }): Promise<{ users: userRecord[] }>
      }
      sync: {
        userDisplayname(_: { userId: user_id; displayName: string }): Promise<ok_ko<void>>
      }
    }
  }
}
