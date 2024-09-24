import { type core_factory, type core_impl } from '@moodle/lib-ddd'
import {
  resetPasswordContent,
  selfDeletionConfirmContent,
  signupEmailConfirmationContent,
} from '@moodle/lib-email-templates/iam/v1_0'
import { EmailLayout } from '@moodle/lib-email-templates/org/v1_0'
import { _never, date_time_string } from '@moodle/lib-types'
import * as v1_0_lib from './v1_0/lib'

export function core(): core_factory {
  return async ctx => {
    const core_impl: core_impl = {
      moodle: {
        iam: {
          v1_0: {
            pri: {
              session: {
                async getCurrentUserSession() {
                  const userSession = await v1_0_lib.validateAnyUserSession(ctx)
                  return { userSession }
                },
                async generateUserSession({ userId }) {
                  return v1_0_lib.generateSessionForUserId(ctx, userId)
                },
              },

              configs: {
                read() {
                  //! FIXME:  implement system session access for primaries and cores
                  // assertSystemSession(primarySession)
                  return ctx.worker.moodle.iam.v1_0.sec.db.getConfigs()
                },
              },
              //get admin():moodle_iam_mod['v1_0']['pri']['admin'] {
              admin: {
                async editUserRoles({ userId, roles }) {
                  const admin_user_session = await v1_0_lib.assert_authorizeAdminUserSession(ctx)

                  const [done] = await ctx.worker.moodle.iam.v1_0.sec.db.changeUserRoles({
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
                  const { users } = await ctx.worker.moodle.iam.v1_0.sec.db.findUsersByText({
                    text: textSearch,
                  })
                  return { users }
                },

                async deactivateUser({ userId, anonymize, reason }) {
                  const admin_user_session = await v1_0_lib.assert_authorizeAdminUserSession(ctx)
                  const [done] = await ctx.worker.moodle.iam.v1_0.sec.db.deactivateUser({
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
                  const schemas = await v1_0_lib.fetchPrimarySchemas(ctx.forward)
                  const { displayName, email, password } = schemas.signupSchema.parse(signupForm)
                  const [found] = await ctx.worker.moodle.iam.v1_0.sec.db.getUserByEmail({
                    email,
                  })
                  if (found) {
                    return [false, { reason: 'userWithSameEmailExists' }]
                  }
                  const {
                    iam: { tokenExpireTime },
                    org: { info: orgInfo, addresses: orgAddr },
                  } = await ctx.worker.moodle.iam.v1_0.sec.db.getConfigs()

                  const { passwordHash } = await ctx.worker.moodle.iam.v1_0.sec.crypto.hashPassword(
                    {
                      plainPassword: password,
                    },
                  )

                  const confirmEmailSession =
                    await ctx.worker.moodle.iam.v1_0.sec.crypto.encryptTokenData({
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

                  const content = signupEmailConfirmationContent({
                    activateAccountUrl: `${redirectUrl}?token=${confirmEmailSession.token}`,
                    orgInfo,
                    receiverEmail: signupForm.email,
                  })

                  const reactBody = EmailLayout({
                    orgInfo,
                    orgAddr,
                    content,
                  })
                  await ctx.worker.moodle.iam.v1_0.sec.email.sendNow({
                    reactBody,
                    subject: content.subject,
                    to: signupForm.email,
                  })
                  return [true, _never]
                },

                async createNewUserByEmailVerificationToken({ signupEmailVerificationToken }) {
                  const {
                    iam: {
                      roles: { newlyCreatedUserRoles },
                    },
                  } = await ctx.worker.moodle.iam.v1_0.sec.db.getConfigs()
                  const [verified, tokenData] =
                    await ctx.worker.moodle.iam.v1_0.sec.crypto.decryptTokenData({
                      token: signupEmailVerificationToken,
                    })

                  if (!(verified && tokenData.type === 'signupRequestEmailVerification')) {
                    return [false, { reason: 'invalidToken' }]
                  }

                  const [, foundSameEmailUser] =
                    await ctx.worker.moodle.iam.v1_0.sec.db.getUserByEmail({
                      email: tokenData.email,
                    })

                  if (foundSameEmailUser) {
                    return [true, { userId: foundSameEmailUser.id }]
                  }

                  const now = date_time_string('now')
                  const newUser = await v1_0_lib.createNewUserRecordData({
                    createdAt: now,
                    roles: newlyCreatedUserRoles,
                    displayName: tokenData.displayName,
                    email: tokenData.email,
                    passwordHash: tokenData.passwordHash,
                    lastLogin: now,
                  })
                  const [newUserCreated] = await ctx.worker.moodle.iam.v1_0.sec.db.saveNewUser({
                    newUser,
                  })
                  return newUserCreated
                    ? [true, { userId: newUser.id }]
                    : [false, { reason: 'unknown' }]
                },
                async login({ loginForm }) {
                  const [found, userRecord] =
                    await ctx.worker.moodle.iam.v1_0.sec.db.getUserByEmail({
                      email: loginForm.email,
                    })
                  if (!(found && !userRecord.deactivated)) {
                    return [false, _never]
                  }
                  const [verified] =
                    await ctx.worker.moodle.iam.v1_0.sec.crypto.verifyUserPasswordHash({
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
                    iam: { tokenExpireTime: userSelfDeletion },
                    org: { info: orgInfo, addresses: orgAddr },
                  } = await ctx.worker.moodle.iam.v1_0.sec.db.getConfigs()

                  const [, user] = await ctx.worker.moodle.iam.v1_0.sec.db.getUserByEmail({
                    email: declaredOwnEmail,
                  })
                  if (!user) {
                    return
                  }

                  const resetPasswordConfirmationSession =
                    await ctx.worker.moodle.iam.v1_0.sec.crypto.encryptTokenData({
                      expiresIn: userSelfDeletion.resetPasswordRequest,
                      data: {
                        v: '1_0',
                        type: 'resetPasswordRequest',
                        redirectUrl,
                        email: user.contacts.email,
                      },
                    })

                  const content = resetPasswordContent({
                    resetPasswordUrl: `${redirectUrl}?token=${resetPasswordConfirmationSession.token}`,
                    receiverEmail: user.contacts.email,
                  })

                  const reactBody = EmailLayout({
                    orgInfo,
                    orgAddr,
                    content,
                  })
                  await ctx.worker.moodle.iam.v1_0.sec.email.sendNow({
                    reactBody,
                    subject: content.subject,
                    to: v1_0_lib.getUserNamedEmailAddress(user),
                  })
                  return
                },
                async logout(/* {sessionToken} */) {
                  //! FIXME implement session_token invalidation
                  return
                },
              },

              myAccount: {
                async selfDeletionRequest({ redirectUrl }) {
                  const authenticated_session =
                    await v1_0_lib.assert_authorizeAuthenticatedUserSession(ctx)
                  const {
                    iam: { tokenExpireTime: userSelfDeletion },
                    org: { info: orgInfo, addresses: orgAddr },
                  } = await ctx.worker.moodle.iam.v1_0.sec.db.getConfigs()

                  const selfDeletionConfirmationSession =
                    await ctx.worker.moodle.iam.v1_0.sec.crypto.encryptTokenData({
                      expiresIn: userSelfDeletion.userSelfDeletionRequest,
                      data: {
                        v: '1_0',
                        type: 'selfDeletionRequestConfirm',
                        redirectUrl,
                        userId: authenticated_session.user.id,
                      },
                    })

                  const content = selfDeletionConfirmContent({
                    deleteAccountUrl: `${redirectUrl}?token=${selfDeletionConfirmationSession.token}`,
                    orgInfo,
                    receiverEmail: authenticated_session.user.contacts.email,
                  })

                  const reactBody = EmailLayout({
                    orgInfo,
                    orgAddr,
                    content,
                  })
                  await ctx.worker.moodle.iam.v1_0.sec.email.sendNow({
                    reactBody,
                    subject: content.subject,
                    to: v1_0_lib.getUserNamedEmailAddress(authenticated_session.user),
                  })
                  return
                },

                async confirmSelfDeletionRequest({ selfDeletionConfirmationToken, reason }) {
                  const [verified, tokenData] =
                    await ctx.worker.moodle.iam.v1_0.sec.crypto.decryptTokenData({
                      token: selfDeletionConfirmationToken,
                    })

                  if (!(verified && tokenData.type === 'selfDeletionRequestConfirm')) {
                    return [false, { reason: 'invalidToken' }]
                  }

                  const [user] = await ctx.worker.moodle.iam.v1_0.sec.db.getUserById({
                    userId: tokenData.userId,
                  })
                  if (!user) {
                    return [false, { reason: 'unknownUser' }]
                  }

                  const [deactivated] = await ctx.worker.moodle.iam.v1_0.sec.db.deactivateUser({
                    anonymize: true,
                    reason: {
                      v: '1_0',
                      type: 'userSelfDeletionRequest',
                      reason,
                    },
                    userId: tokenData.userId,
                  })
                  return deactivated ? [true, _never] : [false, { reason: 'unknown' }]
                },
                async resetPassword({ resetPasswordForm: { newPassword, token } }) {
                  const [verified, tokenData] =
                    await ctx.worker.moodle.iam.v1_0.sec.crypto.decryptTokenData({
                      token,
                    })

                  if (!(verified && tokenData.type === 'resetPasswordRequest')) {
                    return [false, { reason: 'invalidToken' }]
                  }
                  const [found, userRecord] =
                    await ctx.worker.moodle.iam.v1_0.sec.db.getUserByEmail({
                      email: tokenData.email,
                    })
                  if (!found) {
                    return [false, { reason: 'userNotFound' }]
                  }
                  const { passwordHash } = await ctx.worker.moodle.iam.v1_0.sec.crypto.hashPassword(
                    {
                      plainPassword: newPassword,
                    },
                  )
                  const [pwdChanged] = await ctx.worker.moodle.iam.v1_0.sec.db.changeUserPassword({
                    newPasswordHash: passwordHash,
                    userId: userRecord.id,
                  })
                  return pwdChanged ? [true, _never] : [false, { reason: 'unknown' }]
                },

                async changePassword({ currentPassword, newPassword }) {
                  const authenticated_session =
                    await v1_0_lib.assert_authorizeAuthenticatedUserSession(ctx)

                  const [, user] = await ctx.worker.moodle.iam.v1_0.sec.db.getUserById({
                    userId: authenticated_session.user.id,
                  })
                  if (!user) {
                    return [false, { reason: 'unknown' }]
                  }
                  const [currentPasswordVerified] =
                    await ctx.worker.moodle.iam.v1_0.sec.crypto.verifyUserPasswordHash({
                      plainPassword: currentPassword,
                      passwordHash: user.passwordHash,
                    })
                  if (!currentPasswordVerified) {
                    return [false, { reason: 'wrongCurrentPassword' }]
                  }
                  const { passwordHash } = await ctx.worker.moodle.iam.v1_0.sec.crypto.hashPassword(
                    {
                      plainPassword: newPassword,
                    },
                  )
                  await ctx.worker.moodle.iam.v1_0.sec.db.changeUserPassword({
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
  }
}

// export const process: core_process = _ctx => {
//   // setTimeout(getinactiveUsers ....)
// }
