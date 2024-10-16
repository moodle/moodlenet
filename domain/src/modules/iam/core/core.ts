import { generateNanoId } from '@moodle/lib-id-gen'
import { __redacted__, _void, date_time_string, url_string_schema } from '@moodle/lib-types'
import { getIamPrimarySchemas, user_role } from '../'
import { coreBootstrap } from '../../../types'
import {
  assert_authorizeAuthenticatedUserSession,
  assert_authorizeUserSessionWithRole,
  createNewUserRecordData,
  generateSessionForUserData,
  generateSessionForUserId,
  user_record2SessionUserData,
  validateAnyUserSession,
} from '../lib'

export const iam_core: coreBootstrap<'iam'> = ({ log, domain }) => {
  return {
    modName: 'iam',
    provider(coreCtx) {
      return {
        primary(priCtx) {
          return {
            session: {
              async moduleInfo() {
                const {
                  configs: { iamPrimaryMsgSchemaConfigs },
                } = await coreCtx.mod.env.query.modConfigs({ mod: 'iam' })
                return { schemaConfigs: iamPrimaryMsgSchemaConfigs }
              },
              async getUserSession() {
                const userSession = await validateAnyUserSession({ coreCtx, priCtx })
                return { userSession }
              },
              async generateUserSessionToken({ userId }) {
                return generateSessionForUserId({ coreCtx, userId })
              },
            },

            //get admin(){ check () return { ... } }
            admin: {
              async editUserRoles({ userId, role, action }) {
                const admin_user_session = await assert_authorizeUserSessionWithRole({
                  coreCtx,
                  priCtx,
                  role: 'admin',
                })
                const [found, user] = await coreCtx.mod.iam.query.userBy({ by: 'id', userId })
                if (!found) {
                  return [false, { reason: 'userNotFound' }]
                }

                const new_roles_set = new Set(user.roles)
                new_roles_set[action === 'set' ? 'add' : 'delete'](role)
                const new_roles = (
                  new_roles_set.has('admin') ? (['admin', 'publisher'] satisfies user_role[]) : Array.from(new_roles_set)
                ).sort()

                const [done] = await coreCtx.write.setUserRoles({
                  userId,
                  roles: new_roles,
                  adminUserId: admin_user_session.user.id,
                })
                if (!done) {
                  return [false, { reason: 'userNotFound' }]
                }
                return [true, { updatedRoles: new_roles }]
              },

              async searchUsers({ textSearch }) {
                await assert_authorizeUserSessionWithRole({ coreCtx, priCtx, role: 'admin' })
                const { users } = await coreCtx.mod.iam.query.usersByText({
                  text: textSearch,
                })
                return { users }
              },

              async deactivateUser({ userId, anonymize, reason }) {
                const admin_user_session = await assert_authorizeUserSessionWithRole({
                  coreCtx,
                  priCtx,
                  role: 'admin',
                })
                const [done] = await coreCtx.write.deactivateUser({
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
                return [true, _void]
              },
            },
            access: {
              async signupRequest({ signupForm, redirectUrl }) {
                const schemas = await fetchPrimarySchemas()
                const { displayName, email, password } = schemas.signupSchema.parse(signupForm)
                const [found] = await coreCtx.mod.iam.query.userBy({ by: 'email', email })
                if (found) {
                  return [false, { reason: 'userWithSameEmailExists' }]
                }
                const {
                  configs: { tokenExpireTime },
                } = await coreCtx.mod.env.query.modConfigs({ mod: 'iam' })

                const { passwordHash } = await coreCtx.mod.iam.service.hashPassword({
                  plainPassword: password,
                })

                const confirmEmailSession = await coreCtx.mod.iam.service.signDataToken({
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

                coreCtx.queue.notifyUserOnSignupWithEmailConfirmation({
                  activateAccountUrl: url_string_schema.parse(`${redirectUrl}?token=${confirmEmailSession.token}`),
                  signupEmail: signupForm.email,
                  userName: signupForm.displayName,
                })
                return [true, _void]
              },

              async createNewUserByEmailVerificationToken({ signupEmailVerificationToken }) {
                const {
                  configs: {
                    roles: { newlyCreatedUserRoles },
                  },
                } = await coreCtx.mod.env.query.modConfigs({ mod: 'iam' })
                const [verified, validation] = await coreCtx.mod.iam.service.validateSignedToken({
                  token: signupEmailVerificationToken,
                  type: 'signupRequestEmailVerification',
                })

                if (!verified) {
                  return [false, { reason: 'invalidToken' }]
                }
                const { validatedSignedTokenData } = validation
                const [, foundSameEmailUser] = await coreCtx.mod.iam.query.userBy({
                  by: 'email',
                  email: validatedSignedTokenData.email,
                })

                if (foundSameEmailUser) {
                  return [true, { userId: foundSameEmailUser.id }]
                }

                const now = date_time_string('now')
                const newUser = await createNewUserRecordData({
                  createdAt: now,
                  roles: newlyCreatedUserRoles,
                  displayName: validatedSignedTokenData.displayName,
                  email: validatedSignedTokenData.email,
                  passwordHash: validatedSignedTokenData.passwordHash,
                  lastLogin: now,
                })
                const [newUserCreated] = await coreCtx.write.saveNewUser({
                  newUser,
                })
                return newUserCreated ? [true, { userId: newUser.id }] : [false, { reason: 'unknown' }]
              },
              async login({ loginForm }) {
                const [found, user_record] = await coreCtx.mod.iam.query.userBy({
                  by: 'email',
                  email: loginForm.email,
                })
                if (!(found && !user_record.deactivated)) {
                  return [false, _void]
                }
                const [verified] = await coreCtx.mod.iam.service.verifyUserPasswordHash({
                  plainPassword: loginForm.password,
                  passwordHash: user_record.passwordHash,
                })

                if (!verified) {
                  return [false, _void]
                }

                const user = user_record2SessionUserData(user_record)
                const session = await generateSessionForUserData({ coreCtx, user })
                return [
                  true,
                  {
                    session,
                    authenticatedUser: {
                      type: 'authenticated',
                      user,
                    },
                  },
                ]
              },
              async resetPasswordRequest({ declaredOwnEmail, redirectUrl }) {
                const {
                  configs: { tokenExpireTime: userSelfDeletion },
                } = await coreCtx.mod.env.query.modConfigs({ mod: 'iam' })

                const [, user] = await coreCtx.mod.iam.query.userBy({
                  by: 'email',
                  email: declaredOwnEmail,
                })
                if (!user) {
                  return
                }

                const resetPasswordConfirmationSession = await coreCtx.mod.iam.service.signDataToken({
                  expiresIn: userSelfDeletion.resetPasswordRequest,
                  data: {
                    v: '1_0',
                    type: 'resetPasswordRequest',
                    redirectUrl,
                    email: user.contacts.email,
                  },
                })

                coreCtx.queue.notifyUserOnResetPasswordRequest({
                  resetPasswordUrl: url_string_schema.parse(
                    `${redirectUrl}?token=${resetPasswordConfirmationSession.token}`,
                  ),
                  toUserId: user.id,
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
                const authenticated_session = await assert_authorizeAuthenticatedUserSession({
                  coreCtx,
                  priCtx,
                })
                const {
                  configs: { tokenExpireTime: userSelfDeletion },
                } = await coreCtx.mod.env.query.modConfigs({ mod: 'iam' })

                const selfDeletionConfirmationSession = await coreCtx.mod.iam.service.signDataToken({
                  expiresIn: userSelfDeletion.userSelfDeletionRequest,
                  data: {
                    v: '1_0',
                    type: 'selfDeletionRequestConfirm',
                    redirectUrl,
                    userId: authenticated_session.user.id,
                  },
                })

                coreCtx.queue.notifyUserOnAccountSelfDeletionRequest({
                  deleteAccountUrl: url_string_schema.parse(`${redirectUrl}?token=${selfDeletionConfirmationSession.token}`),
                  toUserId: authenticated_session.user.id,
                })
                return
              },

              async confirmSelfDeletionRequest({ selfDeletionConfirmationToken, reason }) {
                const [verified, validation] = await coreCtx.mod.iam.service.validateSignedToken({
                  token: selfDeletionConfirmationToken,
                  type: 'selfDeletionRequestConfirm',
                })

                if (!verified) {
                  return [false, { reason: 'invalidToken' }]
                }
                const { validatedSignedTokenData } = validation

                const [user] = await coreCtx.mod.iam.query.userBy({
                  by: 'id',
                  userId: validatedSignedTokenData.userId,
                })
                if (!user) {
                  return [false, { reason: 'unknownUser' }]
                }

                const [deactivated] = await coreCtx.write.deactivateUser({
                  anonymize: true,
                  reason: {
                    v: '1_0',
                    type: 'userSelfDeletionRequest',
                    reason,
                  },
                  userId: validatedSignedTokenData.userId,
                })
                return deactivated ? [true, _void] : [false, { reason: 'unknown' }]
              },
              async resetPassword({ resetPasswordForm: { newPassword, token } }) {
                const [verified, validation] = await coreCtx.mod.iam.service.validateSignedToken({
                  token,
                  type: 'resetPasswordRequest',
                })

                if (!verified) {
                  return [false, { reason: 'invalidToken' }]
                }

                const { validatedSignedTokenData } = validation
                const [found, user_record] = await coreCtx.mod.iam.query.userBy({
                  by: 'email',
                  email: validatedSignedTokenData.email,
                })
                if (!found) {
                  return [false, { reason: 'userNotFound' }]
                }
                const { passwordHash } = await coreCtx.mod.iam.service.hashPassword({
                  plainPassword: newPassword,
                })
                const [pwdChanged] = await coreCtx.write.setUserPassword({
                  newPasswordHash: passwordHash,
                  userId: user_record.id,
                })
                return pwdChanged ? [true, _void] : [false, { reason: 'unknown' }]
              },

              async changePassword({ currentPassword, newPassword }) {
                const authenticated_session = await assert_authorizeAuthenticatedUserSession({
                  coreCtx,
                  priCtx,
                })

                const [, user] = await coreCtx.mod.iam.query.userBy({
                  by: 'id',
                  userId: authenticated_session.user.id,
                })
                if (!user) {
                  return [false, { reason: 'unknown' }]
                }
                const [currentPasswordVerified] = await coreCtx.mod.iam.service.verifyUserPasswordHash({
                  plainPassword: currentPassword,
                  passwordHash: user.passwordHash,
                })
                if (!currentPasswordVerified) {
                  return [false, { reason: 'wrongCurrentPassword' }]
                }
                const { passwordHash } = await coreCtx.mod.iam.service.hashPassword({
                  plainPassword: newPassword,
                })
                const [done] = await coreCtx.write.setUserPassword({
                  newPasswordHash: passwordHash,
                  userId: authenticated_session.user.id,
                })

                if (!done) {
                  return [false, { reason: 'unknown' }]
                }

                coreCtx.queue.notifyUserOnPasswordChanged({ toUserId: authenticated_session.user.id })
                return [true, _void]
              },
            },
          }
        },
        watch(watchCtx) {
          return {
            secondary: {
              iam: {
                write: {
                  async setUserPassword([[done], { userId }]) {
                    //FIXME: put quite all notification sends as reaction to some atomic event (just like in the case of password change here)
                    if (!done) {
                      return
                    }
                    coreCtx.queue.notifyUserOnPasswordChanged({ toUserId: userId })
                  },
                },
              },
              userHome: {
                write: {
                  async updatePartialProfileInfo([
                    [done, res],
                    {
                      partialProfileInfo: { displayName },
                    },
                  ]) {
                    if (!done || typeof displayName !== 'string') {
                      return
                    }

                    await watchCtx.sync.userDisplayname({
                      displayName,
                      userId: res.userId,
                    })
                  },
                },
              },
            },
          }
        },
        async startBackgroundProcess() {
          log('debug', 'Starting background process IAM')

          const sysAdminInfo = await coreCtx.mod.env.query.getSysAdminInfo()
          const [found] = await coreCtx.mod.iam.query.userBy({
            by: 'email',
            email: sysAdminInfo.email,
          })

          if (!found) {
            const { passwordHash } = await coreCtx.mod.iam.service.hashPassword({
              plainPassword: __redacted__(await generateNanoId({ length: 20 })),
            })
            const newUser = await createNewUserRecordData({
              displayName: 'Admin',
              email: sysAdminInfo.email,
              passwordHash,
              roles: ['admin', 'publisher'],
            })

            await coreCtx.write.saveNewUser({ newUser })
          }
        },
      }
      async function fetchPrimarySchemas() {
        const {
          configs: { iamPrimaryMsgSchemaConfigs },
        } = await coreCtx.mod.env.query.modConfigs({ mod: 'iam' })
        return getIamPrimarySchemas(iamPrimaryMsgSchemaConfigs)
      }
    },
  }
}
