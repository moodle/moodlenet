import type { core_factory, core_impl } from '@moodle/lib-ddd'
import {
  resetPasswordContent,
  selfDeletionConfirmContent,
  signupEmailConfirmationContent,
} from '@moodle/lib-email-templates/iam/v1_0'
import { EmailLayout } from '@moodle/lib-email-templates/org/v1_0'
import { _void, date_time_string } from '@moodle/lib-types'
import * as lib_moodle_org from '@moodle/mod-org/v1_0/lib'
import * as v1_0_lib from './v1_0/lib'

export function core(): core_factory {
  return ({ primarySession, worker }) => {
    const mySec = worker.moodle.iam.v1_0.sec
    const core_impl: core_impl = {
      moodle: {
        iam: {
          v1_0: {
            pri: {
              session: {
                async getUserSession({ sessionToken }) {
                  const userSession = await v1_0_lib.getUserSession(sessionToken, worker)
                  return { userSession }
                },
                async generateUserSession({ userId }) {
                  return v1_0_lib.generateSessionForUserId(userId, worker)
                },
              },

              configs: {
                read() {
                  // assertSystemSession(primarySession)
                  return mySec.db.getConfigs()
                },
              },
              admin: {
                async editUserRoles({ userId, roles }) {
                  await v1_0_lib.assert_validateUserAuthenticatedSessionHasRole(
                    primarySession,
                    'admin',
                    worker,
                  )
                  return mySec.db.changeUserRoles({ userId, roles })
                },

                async searchUsers({ textSearch }) {
                  await v1_0_lib.assert_validateUserAuthenticatedSessionHasRole(
                    primarySession,
                    'admin',
                    worker,
                  )
                  return mySec.db.findUsersByText({ text: textSearch })
                },

                async deactivateUser({ userId, anonymize, reason }) {
                  await v1_0_lib.assert_validateUserAuthenticatedSessionHasRole(
                    primarySession,
                    'admin',
                    worker,
                  )
                  mySec.db.deactivateUser({
                    userId,
                    reason: { type: 'adminRequest', reason ,v:'1_0'},
                    anonymize,
                  })
                },
              },
              signup: {
                async request({ signupForm, redirectUrl }) {
                  v1_0_lib.assertGuestSession(primarySession)
                  const [found] = await mySec.db.getUserByEmail({
                    email: signupForm.email,
                  })
                  if (found) {
                    return [false, { reason: 'userWithSameEmailExists' }]
                  }
                  const {
                    iam: { tokenExpireTime },
                    org: { info: orgInfo, addresses: orgAddr },
                  } = await mySec.db.getConfigs()

                  const { passwordHash } = await mySec.crypto.hashPassword({
                    plainPassword: signupForm.password,
                  })

                  const confirmEmailSession = await mySec.crypto.encryptTokenData({
                    expiresIn: tokenExpireTime.signupEmailVerification,
                    data: {
                      v: '1_0',
                      type: 'signupRequestEmailVerification',
                      redirectUrl,
                      displayName: signupForm.displayName,
                      email: signupForm.email,
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
                  await mySec.email.sendNow({
                    reactBody,
                    sender: lib_moodle_org.getOrgNamedEmailAddress({ orgAddr, orgInfo }),
                    subject: content.subject,
                    to: signupForm.email,
                  })
                  return [true, _void]
                },

                async createNewUserByEmailVerificationToken({ signupEmailVerificationToken }) {
                  v1_0_lib.assertGuestSession(primarySession)
                  const {
                    iam: {
                      roles: { newlyCreatedUserRoles },
                    },
                  } = await mySec.db.getConfigs()
                  const [verified, tokenData] = await mySec.crypto.decryptTokenData({
                    token: signupEmailVerificationToken,
                  })

                  if (!(verified && tokenData.type === 'signupRequestEmailVerification')) {
                    return [false, { reason: 'invalidToken' }]
                  }

                  const [, foundSameEmailUser] = await mySec.db.getUserByEmail({
                    email: tokenData.email,
                  })

                  if (foundSameEmailUser) {
                    return [true, { userId: foundSameEmailUser.id }]
                  }

                  const now = date_time_string('now')
                  const [newUserCreated, userId] = await mySec.db.saveNewUser({
                    newUser: await v1_0_lib.createNewDbUserData({
                      createdAt: now,
                      roles: newlyCreatedUserRoles,
                      displayName: tokenData.displayName,
                      email: tokenData.email,
                      passwordHash: tokenData.passwordHash,
                      lastLogin: now,
                    }),
                  })
                  return newUserCreated ? [true, { userId }] : [false, { reason: 'unknown' }]
                },
              },

              myAccount: {
                async login({ loginForm }) {
                  const [found, dbUser] = await mySec.db.getUserByEmail({
                    email: loginForm.email,
                  })
                  if (!(found && !dbUser.deactivated)) {
                    return [false, _void]
                  }
                  const [verified] = await mySec.crypto.verifyUserPasswordHash({
                    plainPassword: loginForm.password,
                    passwordHash: dbUser.passwordHash,
                  })

                  if (!verified) {
                    return [false, _void]
                  }

                  const user = v1_0_lib.dbUser2UserData(dbUser)
                  const session = await v1_0_lib.generateSessionForUserData(user, worker)
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

                async selfDeletionRequest({ redirectUrl }) {
                  const session = await v1_0_lib.assert_validateUserAuthenticatedSession(
                    primarySession,
                    worker,
                  )
                  const {
                    iam: { tokenExpireTime: userSelfDeletion },
                    org: { info: orgInfo, addresses: orgAddr },
                  } = await mySec.db.getConfigs()

                  const selfDeletionConfirmationSession = await mySec.crypto.encryptTokenData({
                    expiresIn: userSelfDeletion.userSelfDeletionRequest,
                    data: {
                      v: '1_0',
                      type: 'selfDeletionRequestConfirm',
                      redirectUrl,
                      userId: session.user.id,
                    },
                  })

                  const content = selfDeletionConfirmContent({
                    deleteAccountUrl: `${redirectUrl}?token=${selfDeletionConfirmationSession.token}`,
                    orgInfo,
                    receiverEmail: session.user.contacts.email,
                  })

                  const reactBody = EmailLayout({
                    orgInfo,
                    orgAddr,
                    content,
                  })
                  await mySec.email.sendNow({
                    reactBody,
                    sender: lib_moodle_org.getOrgNamedEmailAddress({ orgAddr, orgInfo }),
                    subject: content.subject,
                    to: v1_0_lib.getUserNamedEmailAddress(session.user),
                  })
                  return
                },

                async confirmSelfDeletionRequest({ selfDeletionConfirmationToken, reason }) {
                  const [verified, tokenData] = await mySec.crypto.decryptTokenData({
                    token: selfDeletionConfirmationToken,
                  })

                  if (!(verified && tokenData.type === 'selfDeletionRequestConfirm')) {
                    return [false, { reason: 'invalidToken' }]
                  }

                  const [user] = await mySec.db.getUserById({ userId: tokenData.userId })
                  if (!user) {
                    return [false, { reason: 'unknownUser' }]
                  }

                  const [deactivated] = await mySec.db.deactivateUser({
                    anonymize: true,
                    reason: {
                      v: '1_0',
                      type: 'userSelfDeletionRequest',
                      reason,
                    },
                    userId: tokenData.userId,
                  })
                  return deactivated ? [true, _void] : [false, { reason: 'unknown' }]
                },
                async resetPassword({ resetPasswordForm: { newPassword, token } }) {
                  const [verified, tokenData] = await mySec.crypto.decryptTokenData({
                    token,
                  })

                  if (!(verified && tokenData.type === 'resetPasswordRequest')) {
                    return [false, { reason: 'invalidToken' }]
                  }
                  const [found, dbUser] = await mySec.db.getUserByEmail({ email: tokenData.email })
                  if (!found) {
                    return [false, { reason: 'userNotFound' }]
                  }
                  const { passwordHash } = await mySec.crypto.hashPassword({
                    plainPassword: newPassword,
                  })
                  const [pwdChanged] = await mySec.db.changeUserPassword({
                    newPasswordHash: passwordHash,
                    userId: dbUser.id,
                  })
                  return pwdChanged ? [true, _void] : [false, { reason: 'unknown' }]
                },
                async resetPasswordRequest({ declaredOwnEmail, redirectUrl }) {
                  v1_0_lib.assertGuestSession(primarySession)
                  const {
                    iam: { tokenExpireTime: userSelfDeletion },
                    org: { info: orgInfo, addresses: orgAddr },
                  } = await mySec.db.getConfigs()

                  const [, user] = await mySec.db.getUserByEmail({ email: declaredOwnEmail })
                  if (!user) {
                    return
                  }

                  const resetPasswordConfirmationSession = await mySec.crypto.encryptTokenData({
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
                  await mySec.email.sendNow({
                    reactBody,
                    sender: lib_moodle_org.getOrgNamedEmailAddress({ orgAddr, orgInfo }),
                    subject: content.subject,
                    to: v1_0_lib.getUserNamedEmailAddress(user),
                  })
                  return
                },

                async changePassword({ currentPassword, newPassword }) {
                  const session = await v1_0_lib.assert_validateUserAuthenticatedSession(
                    primarySession,
                    worker,
                  )
                  const [, user] = await mySec.db.getUserById({ userId: session.user.id })
                  if (!user) {
                    return [false, _void]
                  }
                  const [currentPasswordVerified] = await mySec.crypto.verifyUserPasswordHash({
                    plainPassword: currentPassword,
                    passwordHash: user.passwordHash,
                  })
                  if (!currentPasswordVerified) {
                    return [false, _void]
                  }
                  const { passwordHash } = await mySec.crypto.hashPassword({
                    plainPassword: newPassword,
                  })
                  await mySec.db.changeUserPassword({
                    newPasswordHash: passwordHash,
                    userId: session.user.id,
                  })
                  return [true, _void]
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
