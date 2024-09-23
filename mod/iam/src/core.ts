import { error4xx, type core_factory, type core_impl } from '@moodle/lib-ddd'
import {
  resetPasswordContent,
  selfDeletionConfirmContent,
  signupEmailConfirmationContent,
} from '@moodle/lib-email-templates/iam/v1_0'
import { EmailLayout } from '@moodle/lib-email-templates/org/v1_0'
import { _void, date_time_string } from '@moodle/lib-types'
import * as v1_0_lib from './v1_0/lib'

export function core(): core_factory {
  return ({ primarySession, worker, forward }) => {
    const mySec = worker.moodle.iam.v1_0.sec
    const core_impl: core_impl = {
      moodle: {
        iam: {
          v1_0: {
            pri: {
              session: {
                async getUserSession({ sessionToken }) {
                  const userSession = await v1_0_lib.validateAnyUserSession(sessionToken, worker)
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
                  const admin_user_session = await v1_0_lib.validateUserAuthenticatedSessionHasRole(
                    primarySession,
                    'admin',
                    worker,
                  )
                  if (!admin_user_session) {
                    return [false, { reason: 'error4xx', ...error4xx('Forbidden') }]
                  }

                  const [done] = await mySec.db.changeUserRoles({ userId, roles })
                  if (!done) {
                    return [false, { reason: 'error4xx', ...error4xx('Not Found') }]
                  }
                  return [true, _void]
                },

                async searchUsers({ textSearch }) {
                  const admin_user_session = await v1_0_lib.validateUserAuthenticatedSessionHasRole(
                    primarySession,
                    'admin',
                    worker,
                  )
                  if (!admin_user_session) {
                    return [false, { reason: 'error4xx', ...error4xx('Forbidden') }]
                  }
                  return [true, await mySec.db.findUsersByText({ text: textSearch })]
                },

                async deactivateUser({ userId, anonymize, reason }) {
                  const admin_user_session = await v1_0_lib.validateUserAuthenticatedSessionHasRole(
                    primarySession,
                    'admin',
                    worker,
                  )
                  if (!admin_user_session) {
                    return [false, { reason: 'error4xx', ...error4xx('Forbidden') }]
                  }
                  const [done] = await mySec.db.deactivateUser({
                    userId,
                    reason: { type: 'adminRequest', reason, v: '1_0' },
                    anonymize,
                  })
                  if (!done) {
                    return [false, { reason: 'error4xx', ...error4xx('Not Found') }]
                  }
                  return [true, _void]
                },
              },
              signup: {
                async request({ signupForm, redirectUrl }) {
                  const schemas = await v1_0_lib.fetchPrimarySchemas(forward)
                  const { displayName, email, password } = schemas.signupSchema.parse(signupForm)
                  const [found] = await mySec.db.getUserByEmail({
                    email,
                  })
                  if (found) {
                    return [false, { reason: 'userWithSameEmailExists' }]
                  }
                  const {
                    iam: { tokenExpireTime },
                    org: { info: orgInfo, addresses: orgAddr },
                  } = await mySec.db.getConfigs()

                  const { passwordHash } = await mySec.crypto.hashPassword({
                    plainPassword: password,
                  })

                  const confirmEmailSession = await mySec.crypto.encryptTokenData({
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
                  await mySec.email.sendNow({
                    reactBody,
                    subject: content.subject,
                    to: signupForm.email,
                  })
                  return [true, _void]
                },

                async createNewUserByEmailVerificationToken({ signupEmailVerificationToken }) {
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
                  const newUser = await v1_0_lib.createNewUserRecordData({
                    createdAt: now,
                    roles: newlyCreatedUserRoles,
                    displayName: tokenData.displayName,
                    email: tokenData.email,
                    passwordHash: tokenData.passwordHash,
                    lastLogin: now,
                  })
                  const [newUserCreated] = await mySec.db.saveNewUser({
                    newUser,
                  })
                  return newUserCreated
                    ? [true, { userId: newUser.id }]
                    : [false, { reason: 'unknown' }]
                },
              },

              myAccount: {
                async login({ loginForm }) {
                  const [found, userRecord] = await mySec.db.getUserByEmail({
                    email: loginForm.email,
                  })
                  if (!(found && !userRecord.deactivated)) {
                    return [false, _void]
                  }
                  const [verified] = await mySec.crypto.verifyUserPasswordHash({
                    plainPassword: loginForm.password,
                    passwordHash: userRecord.passwordHash,
                  })

                  if (!verified) {
                    return [false, _void]
                  }

                  const user = v1_0_lib.userRecord2SessionUserData(userRecord)
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
                  const authenticated_session = await v1_0_lib.validateUserAuthenticatedSession(
                    primarySession,
                    worker,
                  )
                  if (!authenticated_session) {
                    return
                  }
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
                  await mySec.email.sendNow({
                    reactBody,
                    subject: content.subject,
                    to: v1_0_lib.getUserNamedEmailAddress(authenticated_session.user),
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
                  const [found, userRecord] = await mySec.db.getUserByEmail({
                    email: tokenData.email,
                  })
                  if (!found) {
                    return [false, { reason: 'userNotFound' }]
                  }
                  const { passwordHash } = await mySec.crypto.hashPassword({
                    plainPassword: newPassword,
                  })
                  const [pwdChanged] = await mySec.db.changeUserPassword({
                    newPasswordHash: passwordHash,
                    userId: userRecord.id,
                  })
                  return pwdChanged ? [true, _void] : [false, { reason: 'unknown' }]
                },
                async resetPasswordRequest({ declaredOwnEmail, redirectUrl }) {
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
                    subject: content.subject,
                    to: v1_0_lib.getUserNamedEmailAddress(user),
                  })
                  return
                },

                async changePassword({ currentPassword, newPassword }) {
                  const authenticated_session = await v1_0_lib.validateUserAuthenticatedSession(
                    primarySession,
                    worker,
                  )
                  if (!authenticated_session) {
                    return [false, { reason: 'error4xx', ...error4xx('Forbidden') }]
                  }
                  const [, user] = await mySec.db.getUserById({
                    userId: authenticated_session.user.id,
                  })
                  if (!user) {
                    return [false, { reason: 'unknown' }]
                  }
                  const [currentPasswordVerified] = await mySec.crypto.verifyUserPasswordHash({
                    plainPassword: currentPassword,
                    passwordHash: user.passwordHash,
                  })
                  if (!currentPasswordVerified) {
                    return [false, { reason: 'wrongCurrentPassword' }]
                  }
                  const { passwordHash } = await mySec.crypto.hashPassword({
                    plainPassword: newPassword,
                  })
                  await mySec.db.changeUserPassword({
                    newPasswordHash: passwordHash,
                    userId: authenticated_session.user.id,
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
