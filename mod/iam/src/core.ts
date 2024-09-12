import { core_factory, core_impl, core_process } from '@moodle/domain'
import { _void, date_time_string } from '@moodle/lib-types'
import { v0_1 as org_v0_1 } from '@moodle/mod-org'
import {
  resetPasswordContent,
  selfDeletionConfirmContent,
  signupEmailConfirmationContent,
} from './0_1'
import { assertSession } from './0_1/lib/server'
import { userData } from './0_1/types/db/db-user'

export function core(): core_factory {
  return ({ primarySession, worker }) => {
    const mySec = worker.moodle.iam.v0_1.sec
    const core_impl: core_impl = {
      moodle: {
        iam: {
          v0_1: {
            pri: {
              configs: {
                read() {
                  // assertSession.assertSystemSession(primarySession)
                  return mySec.db.getConfigs()
                },
              },
              admin: {
                async editUserRoles({ userId, roles }) {
                  await assertSession.async_assertUserAuthenticatedSessionHasRole(
                    primarySession,
                    'admin',
                    worker,
                  )
                  return mySec.db.changeUserRoles({ userId, roles })
                },

                async searchUsers({ textSearch }) {
                  await assertSession.async_assertUserAuthenticatedSessionHasRole(
                    primarySession,
                    'admin',
                    worker,
                  )
                  return mySec.db.findUsersByText({ text: textSearch })
                },

                async deactivateUser({ userId, anonymize, reason }) {
                  await assertSession.async_assertUserAuthenticatedSessionHasRole(
                    primarySession,
                    'admin',
                    worker,
                  )
                  mySec.db.deactivateUser({
                    userId,
                    for: { v0_1: 'adminRequest', reason },
                    anonymize,
                  })
                },
              },
              signup: {
                async apply({ signupForm }) {
                  assertSession.assertGuestSession(primarySession)
                  const [found] = await mySec.db.getUserByEmail({
                    email: signupForm.email,
                  })
                  if (found) {
                    return [false, { reason: 'userWithSameEmailExists' }]
                  }
                  const {
                    me: { tokenExpireTime },
                    org: { orgInfo },
                  } = await mySec.db.getConfigs()

                  const { passwordHash } = await mySec.crypto.hashPassword({
                    plainPassword: signupForm.password,
                  })

                  const { encrypted: confirmEmailToken } = await mySec.crypto.encryptToken({
                    expires: tokenExpireTime.signupEmailVerification,
                    data: {
                      v0_1: 'signupRequestEmailVerification',
                      displayName: signupForm.displayName,
                      email: signupForm.email,
                      passwordHash,
                    },
                  })

                  const content = signupEmailConfirmationContent({
                    activateAccountUrl: `#######${confirmEmailToken}#########`,
                    orgInfo,
                    receiverEmail: signupForm.email,
                  })

                  const body = org_v0_1.EmailLayout({ orgInfo, content })
                  mySec.email.enqueue({
                    body,
                    to: signupForm.email,
                    subject: content.subject,
                  })
                  return [true, _void]
                },

                async verifyEmail({ signupEmailVerificationToken }) {
                  assertSession.assertGuestSession(primarySession)
                  const {
                    me: {
                      roles: { newlyCreatedUserRoles },
                    },
                  } = await mySec.db.getConfigs()
                  const [verified, tokenData] = await mySec.crypto.decryptToken({
                    token: signupEmailVerificationToken,
                  })

                  if (!(verified && tokenData.v0_1 === 'signupRequestEmailVerification')) {
                    return [false, { reason: 'invalidToken' }]
                  }

                  const [, foundSameEmailUser] = await mySec.db.getUserByEmail({
                    email: tokenData.email,
                  })

                  if (foundSameEmailUser) {
                    return [true, { userId: foundSameEmailUser.id }]
                  }

                  const { id } = await mySec.crypto.generateUserId()

                  const [newUserDone] = await mySec.db.saveNewUser({
                    newUser: {
                      id,
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
                  return newUserDone ? [true, { userId: id }] : [false, { reason: 'unknown' }]
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

                  return [
                    true,
                    {
                      session: {
                        type: 'authenticated',
                        user: userData(dbUser),
                      },
                    },
                  ]
                },

                async selfDeletionRequest() {
                  const session = await assertSession.async_assertUserAuthenticatedSession(
                    primarySession,
                    worker,
                  )
                  const {
                    me: { tokenExpireTime: userSelfDeletion },
                    org: { orgInfo },
                  } = await mySec.db.getConfigs()

                  const { encrypted: selfDeletionConfirmationToken } =
                    await mySec.crypto.encryptToken({
                      expires: userSelfDeletion.userSelfDeletionRequest,
                      data: {
                        v0_1: 'selfDeletionRequestConfirm',
                        userId: session.user.id,
                      },
                    })

                  const content = selfDeletionConfirmContent({
                    deleteAccountUrl: `#######${selfDeletionConfirmationToken}#########`,
                    orgInfo,
                    receiverEmail: session.user.contacts.email,
                  })

                  const body = org_v0_1.EmailLayout({ orgInfo, content })
                  mySec.email.enqueue({
                    body,
                    to: session.user.contacts.email,
                    subject: content.subject,
                  })
                  return
                },

                async confirmSelfDeletionRequest({ selfDeletionConfirmationToken, reason }) {
                  const [verified, tokenData] = await mySec.crypto.decryptToken({
                    token: selfDeletionConfirmationToken,
                  })

                  if (!(verified && tokenData.v0_1 === 'selfDeletionRequestConfirm')) {
                    return [false, { reason: 'invalidToken' }]
                  }

                  const [user] = await mySec.db.getUserById({ userId: tokenData.userId })
                  if (!user) {
                    return [false, { reason: 'unknownUser' }]
                  }

                  const [deactivated] = await mySec.db.deactivateUser({
                    anonymize: true,
                    for: { v0_1: 'userSelfDeletionRequest', reason },
                    userId: tokenData.userId,
                  })
                  return deactivated ? [true, _void] : [false, { reason: 'unknown' }]
                },

                async resetPasswordRequest({ declaredOwnEmail }) {
                  assertSession.assertGuestSession(primarySession)
                  const {
                    me: { tokenExpireTime: userSelfDeletion },
                    org: { orgInfo },
                  } = await mySec.db.getConfigs()

                  const [, user] = await mySec.db.getUserByEmail({ email: declaredOwnEmail })
                  if (!user) {
                    return
                  }

                  const { encrypted: resetPasswordConfirmationToken } =
                    await mySec.crypto.encryptToken({
                      expires: userSelfDeletion.userSelfDeletionRequest,
                      data: {
                        v0_1: 'passwordResetRequest',
                        email: user.contacts.email,
                      },
                    })

                  const content = resetPasswordContent({
                    resetPasswordUrl: `#######${resetPasswordConfirmationToken}#########`,
                    receiverEmail: user.contacts.email,
                  })

                  const body = org_v0_1.EmailLayout({ orgInfo, content })
                  mySec.email.enqueue({
                    body,
                    to: user.contacts.email,
                    subject: content.subject,
                  })
                  return
                },

                async changePassword({ currentPassword, newPassword }) {
                  const session = await assertSession.async_assertUserAuthenticatedSession(
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

export const process: core_process = ctx => {
  // setTimeout(getinactiveUsers ....)
}
