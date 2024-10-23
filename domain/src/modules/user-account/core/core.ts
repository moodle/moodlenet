import { generateNanoId } from '@moodle/lib-id-gen'
import { __redacted__, _void, date_time_string, url_string_schema } from '@moodle/lib-types'
import { getuserAccountPrimarySchemas, userRole } from '..'
import { moduleCore } from '../../../types'
import {
  assert_authorizeAuthenticatedCurrentUserSession,
  assert_authorizeCurrentUserSessionWithRole,
  createNewUserAccountRecordData,
  generateSessionForUserData,
  generateSessionForUserAccountId,
  userAccountRecord2SessionUserData,
  validateCurrentUserSession,
} from '../lib'

export const userAccount_core: moduleCore<'userAccount'> = {
  modName: 'userAccount',
  primary(ctx) {
    return {
      session: {
        async moduleInfo() {
          const {
            configs: { userAccountPrimaryMsgSchemaConfigs },
          } = await ctx.mod.env.query.modConfigs({ mod: 'userAccount' })
          return { schemaConfigs: userAccountPrimaryMsgSchemaConfigs }
        },
        async getUserSession() {
          const userSession = await validateCurrentUserSession({ ctx })
          return { userSession }
        },
        async generateUserSessionToken({ userAccountId }) {
          return generateSessionForUserAccountId({ ctx, userAccountId })
        },
      },

      //get admin(){ check () return { ... } }
      admin: {
        async editUserRoles({ userAccountId, role, action }) {
          const admin_user_session = await assert_authorizeCurrentUserSessionWithRole({
            ctx,
            role: 'admin',
          })
          const [found, user] = await ctx.mod.userAccount.query.userBy({ by: 'id', userAccountId })
          if (!found) {
            return [false, { reason: 'userNotFound' }]
          }

          const new_roles_set = new Set(user.roles)
          new_roles_set[action === 'set' ? 'add' : 'delete'](role)
          const new_roles = (
            new_roles_set.has('admin') ? (['admin', 'publisher'] satisfies userRole[]) : Array.from(new_roles_set)
          ).sort()

          const [done] = await ctx.write.setUserRoles({
            userAccountId,
            roles: new_roles,
            adminUserAccountId: admin_user_session.user.id,
          })
          if (!done) {
            return [false, { reason: 'userNotFound' }]
          }
          return [true, { updatedRoles: new_roles }]
        },

        async searchUsers({ textSearch }) {
          await assert_authorizeCurrentUserSessionWithRole({ ctx, role: 'admin' })
          const { users } = await ctx.mod.userAccount.query.usersByText({
            text: textSearch,
          })
          return { users }
        },

        async deactivateUser({ userAccountId, anonymize, reason }) {
          const admin_user_session = await assert_authorizeCurrentUserSessionWithRole({
            ctx,
            role: 'admin',
          })
          const [done] = await ctx.write.deactivateUser({
            userAccountId,
            reason: {
              type: 'adminRequest',
              adminUserAccountId: admin_user_session.user.id,
              reason,
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
          const [found] = await ctx.mod.userAccount.query.userBy({ by: 'email', email })
          if (found) {
            return [false, { reason: 'userWithSameEmailExists' }]
          }
          const {
            configs: { tokenExpireTime },
          } = await ctx.mod.env.query.modConfigs({ mod: 'userAccount' })

          const { passwordHash } = await ctx.mod.crypto.service.hashPassword({
            plainPassword: password,
          })

          const confirmEmailSession = await ctx.mod.crypto.service.signDataToken({
            expiresIn: tokenExpireTime.signupEmailVerification,
            data: {
              module: 'userAccount',
              type: 'signupRequestEmailVerification',
              redirectUrl,
              displayName,
              email,
              passwordHash,
            },
          })
          ctx.mod.userNotification.service.enqueueNotificationToUser({
            data: {
              module: 'userAccount',
              type: 'signupWithEmailConfirmation',
              activateAccountUrl: url_string_schema.parse(`${redirectUrl}?token=${confirmEmailSession.token}`),
              signupEmail: signupForm.email,
              userName: signupForm.displayName,
            },
          })
          return [true, _void]
        },

        async createNewUserByEmailVerificationToken({ signupEmailVerificationToken }) {
          const {
            configs: {
              roles: { newlyCreatedUserRoles },
            },
          } = await ctx.mod.env.query.modConfigs({ mod: 'userAccount' })
          const [verified, validation] = await ctx.mod.crypto.service.validateSignedToken({
            token: signupEmailVerificationToken,
            module: 'userAccount',
            type: 'signupRequestEmailVerification',
          })

          if (!verified) {
            return [false, { reason: 'invalidToken' }]
          }
          const { validatedSignedTokenData } = validation
          const [, foundSameEmailUser] = await ctx.mod.userAccount.query.userBy({
            by: 'email',
            email: validatedSignedTokenData.email,
          })

          if (foundSameEmailUser) {
            return [true, { userAccountId: foundSameEmailUser.id }]
          }

          const now = date_time_string('now')
          const newUser = await createNewUserAccountRecordData({
            creationDate: now,
            roles: newlyCreatedUserRoles,
            displayName: validatedSignedTokenData.displayName,
            email: validatedSignedTokenData.email,
            passwordHash: validatedSignedTokenData.passwordHash,
            lastLogin: now,
          })
          const [newUserCreated] = await ctx.write.saveNewUser({
            newUser,
          })
          return newUserCreated ? [true, { userAccountId: newUser.id }] : [false, { reason: 'unknown' }]
        },
        async login({ loginForm }) {
          const [found, userAccountRecord] = await ctx.mod.userAccount.query.userBy({
            by: 'email',
            email: loginForm.email,
          })
          if (!(found && !userAccountRecord.deactivated)) {
            return [false, _void]
          }
          const [verified] = await ctx.mod.crypto.service.verifyPasswordHash({
            plainPassword: loginForm.password,
            passwordHash: userAccountRecord.passwordHash,
          })

          if (!verified) {
            return [false, _void]
          }

          const user = userAccountRecord2SessionUserData(userAccountRecord)
          const session = await generateSessionForUserData({ ctx, user })
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
          } = await ctx.mod.env.query.modConfigs({ mod: 'userAccount' })

          const [, user] = await ctx.mod.userAccount.query.userBy({
            by: 'email',
            email: declaredOwnEmail,
          })
          if (!user) {
            return
          }

          const resetPasswordConfirmationSession = await ctx.mod.crypto.service.signDataToken({
            expiresIn: userSelfDeletion.resetPasswordRequest,
            data: {
              module: 'userAccount',
              type: 'resetPasswordRequest',
              redirectUrl,
              email: user.contacts.email,
            },
          })

          ctx.mod.userNotification.service.enqueueNotificationToUser({
            data: {
              module: 'userAccount',
              type: 'resetPasswordRequest',
              resetPasswordUrl: url_string_schema.parse(`${redirectUrl}?token=${resetPasswordConfirmationSession.token}`),
              toUserAccountId: user.id,
            },
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
          const authenticated_session = await assert_authorizeAuthenticatedCurrentUserSession({ ctx })
          const {
            configs: { tokenExpireTime: userSelfDeletion },
          } = await ctx.mod.env.query.modConfigs({ mod: 'userAccount' })

          const selfDeletionConfirmationSession = await ctx.mod.crypto.service.signDataToken({
            expiresIn: userSelfDeletion.userSelfDeletionRequest,
            data: {
              module: 'userAccount',
              type: 'selfDeletionRequestConfirm',
              redirectUrl,
              userAccountId: authenticated_session.user.id,
            },
          })

          ctx.mod.userNotification.service.enqueueNotificationToUser({
            data: {
              module: 'userAccount',
              type: 'deleteAccountRequest',
              deleteAccountUrl: url_string_schema.parse(`${redirectUrl}?token=${selfDeletionConfirmationSession.token}`),
              toUserAccountId: authenticated_session.user.id,
            },
          })
          return
        },

        async confirmSelfDeletionRequest({ selfDeletionConfirmationToken, reason }) {
          const [verified, validation] = await ctx.mod.crypto.service.validateSignedToken({
            token: selfDeletionConfirmationToken,
            module: 'userAccount',
            type: 'selfDeletionRequestConfirm',
          })

          if (!verified) {
            return [false, { reason: 'invalidToken' }]
          }
          const { validatedSignedTokenData } = validation

          const [user] = await ctx.mod.userAccount.query.userBy({
            by: 'id',
            userAccountId: validatedSignedTokenData.userAccountId,
          })
          if (!user) {
            return [false, { reason: 'unknownUser' }]
          }

          const [deactivated] = await ctx.write.deactivateUser({
            anonymize: true,
            reason: {
              type: 'userSelfDeletionRequest',
              reason,
            },
            userAccountId: validatedSignedTokenData.userAccountId,
          })
          return deactivated ? [true, _void] : [false, { reason: 'unknown' }]
        },
        async resetPassword({ resetPasswordForm: { newPassword, token } }) {
          const [verified, validation] = await ctx.mod.crypto.service.validateSignedToken({
            token,
            module: 'userAccount',
            type: 'resetPasswordRequest',
          })

          if (!verified) {
            return [false, { reason: 'invalidToken' }]
          }

          const { validatedSignedTokenData } = validation
          const [found, userAccountRecord] = await ctx.mod.userAccount.query.userBy({
            by: 'email',
            email: validatedSignedTokenData.email,
          })
          if (!found) {
            return [false, { reason: 'userNotFound' }]
          }
          const { passwordHash } = await ctx.mod.crypto.service.hashPassword({
            plainPassword: newPassword,
          })
          const [pwdChanged] = await ctx.write.setUserPassword({
            newPasswordHash: passwordHash,
            userAccountId: userAccountRecord.id,
          })
          return pwdChanged ? [true, _void] : [false, { reason: 'unknown' }]
        },

        async changePassword({ currentPassword, newPassword }) {
          const authenticated_session = await assert_authorizeAuthenticatedCurrentUserSession({
            ctx,
          })

          const [, user] = await ctx.mod.userAccount.query.userBy({
            by: 'id',
            userAccountId: authenticated_session.user.id,
          })
          if (!user) {
            return [false, { reason: 'unknown' }]
          }
          const [currentPasswordVerified] = await ctx.mod.crypto.service.verifyPasswordHash({
            plainPassword: currentPassword,
            passwordHash: user.passwordHash,
          })
          if (!currentPasswordVerified) {
            return [false, { reason: 'wrongCurrentPassword' }]
          }
          const { passwordHash } = await ctx.mod.crypto.service.hashPassword({
            plainPassword: newPassword,
          })
          const [done] = await ctx.write.setUserPassword({
            newPasswordHash: passwordHash,
            userAccountId: authenticated_session.user.id,
          })

          if (!done) {
            return [false, { reason: 'unknown' }]
          }

          return [true, _void]
        },
      },
    }
    async function fetchPrimarySchemas() {
      const {
        configs: { userAccountPrimaryMsgSchemaConfigs },
      } = await ctx.mod.env.query.modConfigs({ mod: 'userAccount' })
      return getuserAccountPrimarySchemas(userAccountPrimaryMsgSchemaConfigs)
    }
  },
  watch(ctx) {
    return {
      secondary: {
        userAccount: {
          write: {
            async setUserPassword([[done], { userAccountId }]) {
              //FIXME: put quite all notification sends as reaction to some atomic event (just like in the case of password change here)
              if (!done) {
                return
              }
              ctx.mod.userNotification.service.enqueueNotificationToUser({
                data: { module: 'userAccount', type: 'passwordChanged', toUserAccountId: userAccountId },
              })
            },
          },
        },
        userProfile: {
          write: {
            async updatePartialProfileInfo([
              [done],
              {
                userProfileId,
                partialProfileInfo: { displayName },
              },
            ]) {
              if (!done || typeof displayName !== 'string') {
                return
              }
              const [found, response] = await ctx.mod.userProfile.query.getUserProfile({
                by: 'userProfileId',
                userProfileId,
              })
              if (!found) {
                return
              }
              await ctx.sync.userDisplayname({
                displayName,
                userAccountId: response.userProfile.userAccountUser.id,
              })
            },
          },
        },
      },
    }
  },
  async startBackgroundProcess(ctx) {
    ctx.log('debug', 'Starting background process userAccount')

    const sysAdminInfo = await ctx.mod.env.query.getSysAdminInfo()
    const [found] = await ctx.mod.userAccount.query.userBy({
      by: 'email',
      email: sysAdminInfo.email,
    })

    if (!found) {
      const { passwordHash } = await ctx.mod.crypto.service.hashPassword({
        plainPassword: __redacted__(await generateNanoId({ length: 20 })),
      })
      const newUser = await createNewUserAccountRecordData({
        displayName: 'Admin',
        email: sysAdminInfo.email,
        passwordHash,
        roles: ['admin', 'publisher'],
      })

      await ctx.write.saveNewUser({ newUser })
    }
  },
}
