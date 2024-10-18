import { generateNanoId } from '@moodle/lib-id-gen'
import { __redacted__, _void, date_time_string, url_string_schema } from '@moodle/lib-types'
import { getIamPrimarySchemas, user_role } from '../'
import { moduleCore } from '../../../types'
import {
  assert_authorizeAuthenticatedUserSession,
  assert_authorizeUserSessionWithRole,
  createNewUserRecordData,
  generateSessionForUserData,
  generateSessionForUserId,
  user_record2SessionUserData,
  validateAnyUserSession,
} from '../lib'

export const iam_core: moduleCore<'iam'> = {
  modName: 'iam',
  primary(ctx) {
    return {
      session: {
        async moduleInfo() {
          const {
            configs: { iamPrimaryMsgSchemaConfigs },
          } = await ctx.mod.env.query.modConfigs({ mod: 'iam' })
          return { schemaConfigs: iamPrimaryMsgSchemaConfigs }
        },
        async getUserSession() {
          const userSession = await validateAnyUserSession({ ctx })
          return { userSession }
        },
        async generateUserSessionToken({ userId }) {
          return generateSessionForUserId({ ctx, userId })
        },
      },

      //get admin(){ check () return { ... } }
      admin: {
        async editUserRoles({ userId, role, action }) {
          const admin_user_session = await assert_authorizeUserSessionWithRole({
            ctx,
            role: 'admin',
          })
          const [found, user] = await ctx.mod.iam.query.userBy({ by: 'id', userId })
          if (!found) {
            return [false, { reason: 'userNotFound' }]
          }

          const new_roles_set = new Set(user.roles)
          new_roles_set[action === 'set' ? 'add' : 'delete'](role)
          const new_roles = (
            new_roles_set.has('admin') ? (['admin', 'publisher'] satisfies user_role[]) : Array.from(new_roles_set)
          ).sort()

          const [done] = await ctx.write.setUserRoles({
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
          await assert_authorizeUserSessionWithRole({ ctx, role: 'admin' })
          const { users } = await ctx.mod.iam.query.usersByText({
            text: textSearch,
          })
          return { users }
        },

        async deactivateUser({ userId, anonymize, reason }) {
          const admin_user_session = await assert_authorizeUserSessionWithRole({
            ctx,
            role: 'admin',
          })
          const [done] = await ctx.write.deactivateUser({
            userId,
            reason: {
              type: 'adminRequest',
              adminUserId: admin_user_session.user.id,
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
          const [found] = await ctx.mod.iam.query.userBy({ by: 'email', email })
          if (found) {
            return [false, { reason: 'userWithSameEmailExists' }]
          }
          const {
            configs: { tokenExpireTime },
          } = await ctx.mod.env.query.modConfigs({ mod: 'iam' })

          const { passwordHash } = await ctx.mod.crypto.service.hashPassword({
            plainPassword: password,
          })

          const confirmEmailSession = await ctx.mod.crypto.service.signDataToken({
            expiresIn: tokenExpireTime.signupEmailVerification,
            data: {
              module: 'iam',
              type: 'signupRequestEmailVerification',
              redirectUrl,
              displayName,
              email,
              passwordHash,
            },
          })
          ctx.mod.userNotification.service.enqueueNotificationToUser({
            data: {
              module: 'iam',
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
          } = await ctx.mod.env.query.modConfigs({ mod: 'iam' })
          const [verified, validation] = await ctx.mod.crypto.service.validateSignedToken({
            token: signupEmailVerificationToken,
            module: 'iam',
            type: 'signupRequestEmailVerification',
          })

          if (!verified) {
            return [false, { reason: 'invalidToken' }]
          }
          const { validatedSignedTokenData } = validation
          const [, foundSameEmailUser] = await ctx.mod.iam.query.userBy({
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
          const [newUserCreated] = await ctx.write.saveNewUser({
            newUser,
          })
          return newUserCreated ? [true, { userId: newUser.id }] : [false, { reason: 'unknown' }]
        },
        async login({ loginForm }) {
          const [found, user_record] = await ctx.mod.iam.query.userBy({
            by: 'email',
            email: loginForm.email,
          })
          if (!(found && !user_record.deactivated)) {
            return [false, _void]
          }
          const [verified] = await ctx.mod.crypto.service.verifyPasswordHash({
            plainPassword: loginForm.password,
            passwordHash: user_record.passwordHash,
          })

          if (!verified) {
            return [false, _void]
          }

          const user = user_record2SessionUserData(user_record)
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
          } = await ctx.mod.env.query.modConfigs({ mod: 'iam' })

          const [, user] = await ctx.mod.iam.query.userBy({
            by: 'email',
            email: declaredOwnEmail,
          })
          if (!user) {
            return
          }

          const resetPasswordConfirmationSession = await ctx.mod.crypto.service.signDataToken({
            expiresIn: userSelfDeletion.resetPasswordRequest,
            data: {
              module: 'iam',
              type: 'resetPasswordRequest',
              redirectUrl,
              email: user.contacts.email,
            },
          })

          ctx.mod.userNotification.service.enqueueNotificationToUser({
            data: {
              module: 'iam',
              type: 'resetPasswordRequest',
              resetPasswordUrl: url_string_schema.parse(`${redirectUrl}?token=${resetPasswordConfirmationSession.token}`),
              toUserId: user.id,
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
          const authenticated_session = await assert_authorizeAuthenticatedUserSession({ ctx })
          const {
            configs: { tokenExpireTime: userSelfDeletion },
          } = await ctx.mod.env.query.modConfigs({ mod: 'iam' })

          const selfDeletionConfirmationSession = await ctx.mod.crypto.service.signDataToken({
            expiresIn: userSelfDeletion.userSelfDeletionRequest,
            data: {
              module: 'iam',
              type: 'selfDeletionRequestConfirm',
              redirectUrl,
              userId: authenticated_session.user.id,
            },
          })

          ctx.mod.userNotification.service.enqueueNotificationToUser({
            data: {
              module: 'iam',
              type: 'deleteAccountRequest',
              deleteAccountUrl: url_string_schema.parse(`${redirectUrl}?token=${selfDeletionConfirmationSession.token}`),
              toUserId: authenticated_session.user.id,
            },
          })
          return
        },

        async confirmSelfDeletionRequest({ selfDeletionConfirmationToken, reason }) {
          const [verified, validation] = await ctx.mod.crypto.service.validateSignedToken({
            token: selfDeletionConfirmationToken,
            module: 'iam',
            type: 'selfDeletionRequestConfirm',
          })

          if (!verified) {
            return [false, { reason: 'invalidToken' }]
          }
          const { validatedSignedTokenData } = validation

          const [user] = await ctx.mod.iam.query.userBy({
            by: 'id',
            userId: validatedSignedTokenData.userId,
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
            userId: validatedSignedTokenData.userId,
          })
          return deactivated ? [true, _void] : [false, { reason: 'unknown' }]
        },
        async resetPassword({ resetPasswordForm: { newPassword, token } }) {
          const [verified, validation] = await ctx.mod.crypto.service.validateSignedToken({
            token,
            module: 'iam',
            type: 'resetPasswordRequest',
          })

          if (!verified) {
            return [false, { reason: 'invalidToken' }]
          }

          const { validatedSignedTokenData } = validation
          const [found, user_record] = await ctx.mod.iam.query.userBy({
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
            userId: user_record.id,
          })
          return pwdChanged ? [true, _void] : [false, { reason: 'unknown' }]
        },

        async changePassword({ currentPassword, newPassword }) {
          const authenticated_session = await assert_authorizeAuthenticatedUserSession({
            ctx,
          })

          const [, user] = await ctx.mod.iam.query.userBy({
            by: 'id',
            userId: authenticated_session.user.id,
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
            userId: authenticated_session.user.id,
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
        configs: { iamPrimaryMsgSchemaConfigs },
      } = await ctx.mod.env.query.modConfigs({ mod: 'iam' })
      return getIamPrimarySchemas(iamPrimaryMsgSchemaConfigs)
    }
  },
  watch(ctx) {
    return {
      secondary: {
        iam: {
          write: {
            async setUserPassword([[done], { userId }]) {
              //FIXME: put quite all notification sends as reaction to some atomic event (just like in the case of password change here)
              if (!done) {
                return
              }
              ctx.mod.userNotification.service.enqueueNotificationToUser({
                data: { module: 'iam', type: 'passwordChanged', toUserId: userId },
              })
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

              await ctx.sync.userDisplayname({
                displayName,
                userId: res.userId,
              })
            },
          },
        },
      },
    }
  },
  async startBackgroundProcess(ctx) {
    ctx.log('debug', 'Starting background process IAM')

    const sysAdminInfo = await ctx.mod.env.query.getSysAdminInfo()
    const [found] = await ctx.mod.iam.query.userBy({
      by: 'email',
      email: sysAdminInfo.email,
    })

    if (!found) {
      const { passwordHash } = await ctx.mod.crypto.service.hashPassword({
        plainPassword: __redacted__(await generateNanoId({ length: 20 })),
      })
      const newUser = await createNewUserRecordData({
        displayName: 'Admin',
        email: sysAdminInfo.email,
        passwordHash,
        roles: ['admin', 'publisher'],
      })

      await ctx.write.saveNewUser({ newUser })
    }
  },
}

