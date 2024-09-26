import { type core_factory, type core_impl } from '@moodle/lib-ddd'
import {
  resetPasswordEmail,
  selfDeletionConfirmEmail,
  signupEmailConfirmationEmail,
} from '@moodle/lib-email-templates/iam/v1_0'
import { _never, date_time_string } from '@moodle/lib-types'
import * as v1_0_lib from './v1_0/lib'

export function core(): core_factory {
  return async ctx => {
    const core_impl: core_impl = {
      moodle: {
        iam: {
          v1_0: {
            pri: {
              system: {
                async configs() {
                  await v1_0_lib.assert_authorizeSystemSession(ctx)
                  return ctx.sysCall.moodle.iam.v1_0.sec.db.getConfigs()
                },
              },
              session: {
                async getCurrentUserSession() {
                  const userSession = await v1_0_lib.validateAnyUserSession(ctx)
                  return { userSession }
                },
                async generateUserSession({ userId }) {
                  return v1_0_lib.generateSessionForUserId(ctx, userId)
                },
              },

              //get admin():moodle_iam_mod['v1_0']['pri']['admin'] {
              admin: {
                async setUserRoles({ userId, roles }) {
                  const admin_user_session = await v1_0_lib.assert_authorizeAdminUserSession(ctx)

                  const [done] = await ctx.sysCall.moodle.iam.v1_0.sec.db.setUserRoles({
                    userId,
                    roles,
                    adminUserId: admin_user_session.user.id,
                  })
                  if (!done) {
                    return [false, { reason: 'userNotFound' }]
                  }
                  return [true, _never]
                },

                async searchUsers({ textSearch }) {
                  await v1_0_lib.assert_authorizeAdminUserSession(ctx)
                  const { users } = await ctx.sysCall.moodle.iam.v1_0.sec.db.findUsersByText({
                    text: textSearch,
                  })
                  return { users }
                },

                async deactivateUser({ userId, anonymize, reason }) {
                  const admin_user_session = await v1_0_lib.assert_authorizeAdminUserSession(ctx)
                  const [done] = await ctx.sysCall.moodle.iam.v1_0.sec.db.deactivateUser({
                    userId,
                    reason: {
                      type: 'adminRequest',
                      adminUserId: admin_user_session.user.id,
                      reason,
                      v: '1_0',
                    },
                    anonymize,
                  })
                  if (!done) {
                    return [false, { reason: 'userNotFound' }]
                  }
                  return [true, _never]
                },
              },
              access: {
                async request({ signupForm, redirectUrl }) {
                  const schemas = await fetchPrimarySchemas()
                  const { displayName, email, password } = schemas.signupSchema.parse(signupForm)
                  const [found] = await ctx.sysCall.moodle.iam.v1_0.sec.db.getUserByEmail({
                    email,
                  })
                  if (found) {
                    return [false, { reason: 'userWithSameEmailExists' }]
                  }
                  const {
                    configs: { tokenExpireTime },
                  } = await ctx.sysCall.moodle.iam.v1_0.sec.db.getConfigs()

                  const { passwordHash } =
                    await ctx.sysCall.moodle.iam.v1_0.sec.crypto.hashPassword({
                      plainPassword: password,
                    })

                  const confirmEmailSession =
                    await ctx.sysCall.moodle.iam.v1_0.sec.crypto.signDataToken({
                      expiresIn: tokenExpireTime.signupEmailVerification,
                      data: {
                        v: '1_0',
                        type: 'signupRequestEmailVerification',
                        redirectUrl,
                        displayName,
                        email,
                        passwordHash,
                      },
                    })

                  const { emailProps, reactBody } = await signupEmailConfirmationEmail({
                    ctx,
                    activateAccountUrl: `${redirectUrl}?token=${confirmEmailSession.token}`,
                    receiverEmail: signupForm.email,
                  })

                  await ctx.sysCall.moodle.iam.v1_0.sec.email.sendNow({
                    reactBody,
                    subject: emailProps.content.subject,
                    to: signupForm.email,
                  })
                  return [true, _never]
                },

                async createNewUserByEmailVerificationToken({ signupEmailVerificationToken }) {
                  const {
                    configs: {
                      roles: { newlyCreatedUserRoles },
                    },
                  } = await ctx.sysCall.moodle.iam.v1_0.sec.db.getConfigs()
                  const [verified, validation] =
                    await ctx.sysCall.moodle.iam.v1_0.sec.crypto.validateSignedToken({
                      token: signupEmailVerificationToken,
                      type: 'signupRequestEmailVerification',
                    })

                  if (!verified) {
                    return [false, { reason: 'invalidToken' }]
                  }
                  const { validatedSignedTokenData } = validation
                  const [, foundSameEmailUser] =
                    await ctx.sysCall.moodle.iam.v1_0.sec.db.getUserByEmail({
                      email: validatedSignedTokenData.email,
                    })

                  if (foundSameEmailUser) {
                    return [true, { userId: foundSameEmailUser.id }]
                  }

                  const now = date_time_string('now')
                  const newUser = await v1_0_lib.createNewUserRecordData({
                    createdAt: now,
                    roles: newlyCreatedUserRoles,
                    displayName: validatedSignedTokenData.displayName,
                    email: validatedSignedTokenData.email,
                    passwordHash: validatedSignedTokenData.passwordHash,
                    lastLogin: now,
                  })
                  const [newUserCreated] = await ctx.sysCall.moodle.iam.v1_0.sec.db.saveNewUser({
                    newUser,
                  })
                  return newUserCreated
                    ? [true, { userId: newUser.id }]
                    : [false, { reason: 'unknown' }]
                },
                async login({ loginForm }) {
                  const [found, userRecord] =
                    await ctx.sysCall.moodle.iam.v1_0.sec.db.getUserByEmail({
                      email: loginForm.email,
                    })
                  if (!(found && !userRecord.deactivated)) {
                    return [false, _never]
                  }
                  const [verified] =
                    await ctx.sysCall.moodle.iam.v1_0.sec.crypto.verifyUserPasswordHash({
                      plainPassword: loginForm.password,
                      passwordHash: userRecord.passwordHash,
                    })

                  if (!verified) {
                    return [false, _never]
                  }

                  const user = v1_0_lib.userRecord2SessionUserData(userRecord)
                  const session = await v1_0_lib.generateSessionForUserData(ctx, user)
                  return [
                    true,
                    {
                      session,
                      authenticatedSession: {
                        type: 'authenticated',
                        user,
                      },
                    },
                  ]
                },
                async resetPasswordRequest({ declaredOwnEmail, redirectUrl }) {
                  const {
                    configs: { tokenExpireTime: userSelfDeletion },
                  } = await ctx.sysCall.moodle.iam.v1_0.sec.db.getConfigs()

                  const [, user] = await ctx.sysCall.moodle.iam.v1_0.sec.db.getUserByEmail({
                    email: declaredOwnEmail,
                  })
                  if (!user) {
                    return
                  }

                  const resetPasswordConfirmationSession =
                    await ctx.sysCall.moodle.iam.v1_0.sec.crypto.signDataToken({
                      expiresIn: userSelfDeletion.resetPasswordRequest,
                      data: {
                        v: '1_0',
                        type: 'resetPasswordRequest',
                        redirectUrl,
                        email: user.contacts.email,
                      },
                    })

                  const { emailProps, reactBody } = await resetPasswordEmail({
                    ctx,
                    resetPasswordUrl: `${redirectUrl}?token=${resetPasswordConfirmationSession.token}`,
                    receiverEmail: user.contacts.email,
                  })
                  await ctx.sysCall.moodle.iam.v1_0.sec.email.sendNow({
                    reactBody,
                    subject: emailProps.content.subject,
                    to: v1_0_lib.getUserNamedEmailAddress(user),
                  })
                  return
                },
                async logout(/* {sessionToken} */) {
                  // TODO implement session_token invalidation
                  //! -------------------------------------
                  return
                },
              },

              myAccount: {
                async selfDeletionRequest({ redirectUrl }) {
                  const authenticated_session =
                    await v1_0_lib.assert_authorizeAuthenticatedUserSession(ctx)
                  const {
                    configs: { tokenExpireTime: userSelfDeletion },
                  } = await ctx.sysCall.moodle.iam.v1_0.sec.db.getConfigs()

                  const selfDeletionConfirmationSession =
                    await ctx.sysCall.moodle.iam.v1_0.sec.crypto.signDataToken({
                      expiresIn: userSelfDeletion.userSelfDeletionRequest,
                      data: {
                        v: '1_0',
                        type: 'selfDeletionRequestConfirm',
                        redirectUrl,
                        userId: authenticated_session.user.id,
                      },
                    })

                  const { emailProps, reactBody } = await selfDeletionConfirmEmail({
                    ctx,
                    deleteAccountUrl: `${redirectUrl}?token=${selfDeletionConfirmationSession.token}`,
                    receiverEmail: authenticated_session.user.contacts.email,
                  })
                  await ctx.sysCall.moodle.iam.v1_0.sec.email.sendNow({
                    reactBody,
                    subject: emailProps.content.subject,
                    to: v1_0_lib.getUserNamedEmailAddress(authenticated_session.user),
                  })
                  return
                },

                async confirmSelfDeletionRequest({ selfDeletionConfirmationToken, reason }) {
                  const [verified, validation] =
                    await ctx.sysCall.moodle.iam.v1_0.sec.crypto.validateSignedToken({
                      token: selfDeletionConfirmationToken,
                      type: 'selfDeletionRequestConfirm',
                    })

                  if (!verified) {
                    return [false, { reason: 'invalidToken' }]
                  }
                  const { validatedSignedTokenData } = validation

                  const [user] = await ctx.sysCall.moodle.iam.v1_0.sec.db.getUserById({
                    userId: validatedSignedTokenData.userId,
                  })
                  if (!user) {
                    return [false, { reason: 'unknownUser' }]
                  }

                  const [deactivated] = await ctx.sysCall.moodle.iam.v1_0.sec.db.deactivateUser({
                    anonymize: true,
                    reason: {
                      v: '1_0',
                      type: 'userSelfDeletionRequest',
                      reason,
                    },
                    userId: validatedSignedTokenData.userId,
                  })
                  return deactivated ? [true, _never] : [false, { reason: 'unknown' }]
                },
                async resetPassword({ resetPasswordForm: { newPassword, token } }) {
                  const [verified, validation] =
                    await ctx.sysCall.moodle.iam.v1_0.sec.crypto.validateSignedToken({
                      token,
                      type: 'resetPasswordRequest',
                    })

                  if (!verified) {
                    return [false, { reason: 'invalidToken' }]
                  }

                  const { validatedSignedTokenData } = validation
                  const [found, userRecord] =
                    await ctx.sysCall.moodle.iam.v1_0.sec.db.getUserByEmail({
                      email: validatedSignedTokenData.email,
                    })
                  if (!found) {
                    return [false, { reason: 'userNotFound' }]
                  }
                  const { passwordHash } =
                    await ctx.sysCall.moodle.iam.v1_0.sec.crypto.hashPassword({
                      plainPassword: newPassword,
                    })
                  const [pwdChanged] = await ctx.sysCall.moodle.iam.v1_0.sec.db.setUserPassword({
                    newPasswordHash: passwordHash,
                    userId: userRecord.id,
                  })
                  return pwdChanged ? [true, _never] : [false, { reason: 'unknown' }]
                },

                async changePassword({ currentPassword, newPassword }) {
                  const authenticated_session =
                    await v1_0_lib.assert_authorizeAuthenticatedUserSession(ctx)

                  const [, user] = await ctx.sysCall.moodle.iam.v1_0.sec.db.getUserById({
                    userId: authenticated_session.user.id,
                  })
                  if (!user) {
                    return [false, { reason: 'unknown' }]
                  }
                  const [currentPasswordVerified] =
                    await ctx.sysCall.moodle.iam.v1_0.sec.crypto.verifyUserPasswordHash({
                      plainPassword: currentPassword,
                      passwordHash: user.passwordHash,
                    })
                  if (!currentPasswordVerified) {
                    return [false, { reason: 'wrongCurrentPassword' }]
                  }
                  const { passwordHash } =
                    await ctx.sysCall.moodle.iam.v1_0.sec.crypto.hashPassword({
                      plainPassword: newPassword,
                    })
                  await ctx.sysCall.moodle.iam.v1_0.sec.db.setUserPassword({
                    newPasswordHash: passwordHash,
                    userId: authenticated_session.user.id,
                  })
                  return [true, _never]
                },
              },
            },

            evt: {
              // userActivity: {
              //   userLoggedIn(ctx) {},
              // },
              // userBase: {
              //   newUserCreated(ctx) {},
              //   userDeactivated(ctx) {},
              // },
              // userRoles: {
              //   userRolesUpdated(ctx) {},
              // },
              // userSecurity: {
              //   userPasswordChanged(ctx) {},
              // },
            },
          },
        },
      },
    }
    return core_impl
    async function fetchPrimarySchemas() {
      const {
        configs: { iamPrimaryMsgSchemaConfigs },
      } = await ctx.sysCall.moodle.iam.v1_0.sec.db.getConfigs()
      return v1_0_lib.getIamPrimarySchemas(iamPrimaryMsgSchemaConfigs)
    }
  }
}

// export const process: core_process = _ctx => {
//   // setTimeout(getinactiveUsers ....)
// }
