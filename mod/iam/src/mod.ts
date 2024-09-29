import type { session_token } from '@moodle/lib-ddd'
import type {
  __redacted__,
  _maybe,
  d_u__d,
  date_time_string,
  email_address,
  named_or_email_address,
  ok_ko,
  signed_expire_token,
  signed_token,
  time_duration_string,
  url_string,
} from '@moodle/lib-types'
import type { ReactElement } from 'react'

import type {
  changePasswordForm,
  Configs,
  iamSignTokenData,
  loginForm,
  resetPasswordForm,
  signupForm,
  user_deactivation_reason,
  user_id,
  user_plain_password,
  user_record,
  user_role,
  user_session,
} from './types'

declare module '@moodle/lib-ddd' {
  export interface Domain {
    entity: {
      'v5.0': {
        moodle: {
          iam: {
            user:{
              [uid:string]: _maybe<user_record>
            }
            configs:Configs
          }
        }
      }
    }
    primary: {
      'v5.0': {
        moodle: {
          iam: {
            session: {
              getCurrentUserSession(): Promise<{ userSession: user_session }>
              generateUserSession(_: {
                userId: user_id
              }): Promise<ok_ko<signed_expire_token, { userNotFound: unknown }>>
            }

            system: {
              configs(): Promise<{ configs: Configs }>
            }

            admin: {
              setUserRoles(_: {
                userId: user_id
                roles: user_role[]
              }): Promise<ok_ko<never, { userNotFound: unknown }>>
              searchUsers(_: { textSearch: string }): Promise<{ users: user_record[] }>
              deactivateUser(_: {
                userId: user_id
                reason: string
                anonymize: boolean
              }): Promise<ok_ko<never, { userNotFound: unknown }>>
            }

            access: {
              request(_: {
                signupForm: signupForm
                redirectUrl: url_string
              }): Promise<ok_ko<never, { userWithSameEmailExists: unknown }>>

              createNewUserByEmailVerificationToken(_: {
                signupEmailVerificationToken: signed_token
              }): Promise<
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
                  authenticatedSession: d_u__d<user_session, 'type', 'authenticated'>
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
              }): Promise<
                ok_ko<never, { invalidToken: unknown; unknownUser: unknown; unknown: unknown }>
              >

              resetPassword(_: {
                resetPasswordForm: resetPasswordForm
              }): Promise<
                ok_ko<never, { invalidToken: unknown; userNotFound: unknown; unknown: unknown }>
              >

              changePassword(
                _: changePasswordForm,
              ): Promise<ok_ko<never, { wrongCurrentPassword: unknown; unknown: unknown }>>
            }
          }
        }
      }
    }
    secondary: {
      'v5.0': {
        moodle: {
          iam: {
            crypto: {
              hashPassword(_: {
                plainPassword: __redacted__<user_plain_password>
              }): Promise<{ passwordHash: string }>
              verifyUserPasswordHash(_: {
                plainPassword: __redacted__<user_plain_password>
                passwordHash: string
              }): Promise<ok_ko<never>>

              signDataToken(_: {
                data: iamSignTokenData
                expiresIn: time_duration_string
              }): Promise<signed_expire_token>
              validateSignedToken<type extends iamSignTokenData['type']>(_: {
                token: signed_token
                type: type
              }): Promise<
                ok_ko<
                  { validatedSignedTokenData: d_u__d<iamSignTokenData, 'type', type> },
                  { invalid: unknown; validatedUnknownType: { data: unknown } }
                >
              >
              //NOTE: implement decodeNoValidateSignedToken(_: { token: session_token }): Promise<ok_ko<{__NOT_VALIDATED_SESSION_TOKEN_DATA__:iamSignTokenData}>>
            }

            email: {
              sendNow(_: {
                to: named_or_email_address
                subject: string
                reactBody: ReactElement
              }): Promise<void>
            }

            db: {
              getConfigs(): Promise<{ configs: Configs }>

              setUserPassword(_: {
                userId: user_id
                newPasswordHash: string
              }): Promise<ok_ko<never>>

              deactivateUser(_: {
                userId: user_id
                anonymize: boolean
                reason: user_deactivation_reason
                at?: date_time_string
              }): Promise<ok_ko<never>>

              getActiveUsersNotLoggedInFor(_: {
                time: time_duration_string
                inactiveNotificationSent: boolean
              }): Promise<{ inactiveUsers: user_record[] }>

              getUserById(_: { userId: user_id }): Promise<ok_ko<user_record>>
              getUserByEmail(_: { email: email_address }): Promise<ok_ko<user_record>>

              saveNewUser(_: { newUser: user_record }): Promise<ok_ko<never>>

              setUserRoles(_: {
                userId: user_id
                roles: user_role[]
                adminUserId: user_id
              }): Promise<ok_ko<never>>

              findUsersByText(_: {
                text: string
                includeDeactivated?: boolean
              }): Promise<{ users: user_record[] }>
            }
          }
        }
      }
    }
    event: {
      'v5.0': {
        moodle: {
          iam: {
            userBase: {
              userDeactivated(_: {
                user: user_record
                reason: user_deactivation_reason
                anonymized: boolean
              }): unknown
              newUserCreated(_: { user: user_record }): unknown
            }
            userSecurity: {
              userPasswordChanged(_: { userId: user_id }): unknown
            }
            userRoles: {
              userRolesUpdated(_: {
                userId: user_id
                roles: user_role[]
                oldRoles: user_role[]
              }): unknown
            }
            userActivity: {
              userLoggedIn(_: { userId: user_id }): unknown
            }
          }
        }
      }
    }
  }
}
