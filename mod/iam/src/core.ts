import { core_factory, core_impl } from '@moodle/domain'
import { lib_moodle_iam, lib_moodle_org } from '@moodle/lib-domain'
import { email_moodle_iam, email_moodle_org } from '@moodle/lib-email-templates'
import { _void, date_time_string } from '@moodle/lib-types'
import {
  assert_validateUserAuthenticatedSession,
  assert_validateUserAuthenticatedSessionHasRole,
  assertGuestSession,
  generateSessionForUserData,
  generateSessionForUserId,
  getUserSession,
} from './v1_0'
import { userData } from './v1_0/types/db/db-user'
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
                  const userSession = await getUserSession(sessionToken, worker)
                  return { userSession }
                },
                async generateUserSession({ userId }) {
                  return generateSessionForUserId(userId, worker)
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
                  await assert_validateUserAuthenticatedSessionHasRole(
                    primarySession,
                    'admin',
                    worker,
                  )
                  return mySec.db.changeUserRoles({ userId, roles })
                },

                async searchUsers({ textSearch }) {
                  await assert_validateUserAuthenticatedSessionHasRole(
                    primarySession,
                    'admin',
                    worker,
                  )
                  return mySec.db.findUsersByText({ text: textSearch })
                },

                async deactivateUser({ userId, anonymize, reason }) {
                  await assert_validateUserAuthenticatedSessionHasRole(
                    primarySession,
                    'admin',
                    worker,
                  )
                  mySec.db.deactivateUser({
                    userId,
                    for: { v1_0: 'adminRequest', reason },
                    anonymize,
                  })
                },
              },
              signup: {
                async request({ signupForm, redirectUrl }) {
                  assertGuestSession(primarySession)
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

                  const confirmEmailSession = await mySec.crypto.encryptSession({
                    expiresIn: tokenExpireTime.signupEmailVerification,
                    data: {
                      v1_0: 'signupRequestEmailVerification',
                      redirectUrl,
                      displayName: signupForm.displayName,
                      email: signupForm.email,
                      passwordHash,
                    },
                  })

                  const content = email_moodle_iam.v1_0.signupEmailConfirmationContent({
                    activateAccountUrl: `${redirectUrl}?token=${confirmEmailSession.token}`,
                    orgInfo,
                    receiverEmail: signupForm.email,
                  })

                  const reactBody = email_moodle_org.v1_0.EmailLayout({
                    orgInfo,
                    orgAddr,
                    content,
                  })
                  await mySec.email.sendNow({
                    reactBody,
                    sender: lib_moodle_org.v1_0.getOrgNamedEmailAddress({ orgAddr, orgInfo }),
                    subject: content.subject,
                    to: signupForm.email,
                  })
                  return [true, _void]
                },

                async verifyEmail({ signupEmailVerificationToken }) {
                  assertGuestSession(primarySession)
                  const {
                    iam: {
                      roles: { newlyCreatedUserRoles },
                    },
                  } = await mySec.db.getConfigs()
                  const [verified, tokenData] = await mySec.crypto.decryptSession({
                    token: signupEmailVerificationToken,
                  })

                  if (!(verified && tokenData.v1_0 === 'signupRequestEmailVerification')) {
                    return [false, { reason: 'invalidToken' }]
                  }

                  const [, foundSameEmailUser] = await mySec.db.getUserByEmail({
                    email: tokenData.email,
                  })

                  if (foundSameEmailUser) {
                    return [true, { userId: foundSameEmailUser.id }]
                  }

                  const [newUserCreated, userId] = await mySec.db.saveNewUser({
                    idType: {
                      type: 'alphanumeric',
                      length: 8,
                    },
                    newUser: {
                      roles: newlyCreatedUserRoles,
                      displayName: tokenData.displayName,
                      contacts: {
                        email: tokenData.email,
                      },
                      passwordHash: tokenData.passwordHash,
                      activityStatus: {
                        lastLogin: date_time_string('now'),
                        inactiveNotificationSentAt: false,
                      },
                      deactivated: false,
                    },
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

                  const user = userData(dbUser)
                  const session = await generateSessionForUserData(user, worker)
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
                  const session = await assert_validateUserAuthenticatedSession(
                    primarySession,
                    worker,
                  )
                  const {
                    iam: { tokenExpireTime: userSelfDeletion },
                    org: { info: orgInfo, addresses: orgAddr },
                  } = await mySec.db.getConfigs()

                  const selfDeletionConfirmationSession = await mySec.crypto.encryptSession({
                    expiresIn: userSelfDeletion.userSelfDeletionRequest,
                    data: {
                      v1_0: 'selfDeletionRequestConfirm',
                      redirectUrl,
                      userId: session.user.id,
                    },
                  })

                  const content = email_moodle_iam.v1_0.selfDeletionConfirmContent({
                    deleteAccountUrl: `${redirectUrl}?token=${selfDeletionConfirmationSession.token}`,
                    orgInfo,
                    receiverEmail: session.user.contacts.email,
                  })

                  const reactBody = email_moodle_org.v1_0.EmailLayout({
                    orgInfo,
                    orgAddr,
                    content,
                  })
                  await mySec.email.sendNow({
                    reactBody,
                    sender: lib_moodle_org.v1_0.getOrgNamedEmailAddress({ orgAddr, orgInfo }),
                    subject: content.subject,
                    to: lib_moodle_iam.v1_0.getUserNamedEmailAddress(session.user),
                  })
                  return
                },

                async confirmSelfDeletionRequest({ selfDeletionConfirmationToken, reason }) {
                  const [verified, tokenData] = await mySec.crypto.decryptSession({
                    token: selfDeletionConfirmationToken,
                  })

                  if (!(verified && tokenData.v1_0 === 'selfDeletionRequestConfirm')) {
                    return [false, { reason: 'invalidToken' }]
                  }

                  const [user] = await mySec.db.getUserById({ userId: tokenData.userId })
                  if (!user) {
                    return [false, { reason: 'unknownUser' }]
                  }

                  const [deactivated] = await mySec.db.deactivateUser({
                    anonymize: true,
                    for: { v1_0: 'userSelfDeletionRequest', reason },
                    userId: tokenData.userId,
                  })
                  return deactivated ? [true, _void] : [false, { reason: 'unknown' }]
                },

                async resetPasswordRequest({ declaredOwnEmail, redirectUrl }) {
                  assertGuestSession(primarySession)
                  const {
                    iam: { tokenExpireTime: userSelfDeletion },
                    org: { info: orgInfo, addresses: orgAddr },
                  } = await mySec.db.getConfigs()

                  const [, user] = await mySec.db.getUserByEmail({ email: declaredOwnEmail })
                  if (!user) {
                    return
                  }

                  const resetPasswordConfirmationSession = await mySec.crypto.encryptSession({
                    expiresIn: userSelfDeletion.userSelfDeletionRequest,
                    data: {
                      v1_0: 'passwordResetRequest',
                      redirectUrl,
                      email: user.contacts.email,
                    },
                  })

                  const content = email_moodle_iam.v1_0.resetPasswordContent({
                    resetPasswordUrl: `${redirectUrl}?token=${resetPasswordConfirmationSession.token}`,
                    receiverEmail: user.contacts.email,
                  })

                  const reactBody = email_moodle_org.v1_0.EmailLayout({
                    orgInfo,
                    orgAddr,
                    content,
                  })
                  await mySec.email.sendNow({
                    reactBody,
                    sender: lib_moodle_org.v1_0.getOrgNamedEmailAddress({ orgAddr, orgInfo }),
                    subject: content.subject,
                    to: lib_moodle_iam.v1_0.getUserNamedEmailAddress(user),
                  })
                  return
                },

                async changePassword({ currentPassword, newPassword }) {
                  const session = await assert_validateUserAuthenticatedSession(
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
