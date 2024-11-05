import { generateNanoId } from '@moodle/lib-id-gen'
import { __redacted__, _void, date_time_string, url_string_schema } from '@moodle/lib-types'
import userAccountDomain, { getuserAccountPrimarySchemas, userRole } from '..'
import { moduleCore } from '../../../types'
import {
  assert_authorizeAuthenticatedCurrentUserSession,
  assert_authorizeCurrentUserSessionWithRole,
  createNewUserAccountRecordData,
  generateSessionForUserAccountId,
  validateCurrentUserSession,
} from '../lib'
import assert from 'assert'

type primary = userAccountDomain['primary']['userAccount']
export const userAccount_core: moduleCore<'userAccount'> = {
  modName: 'userAccount',
  service(ctx) {
    return {
      async generateUserSessionToken({ userAccountId }) {
        return generateSessionForUserAccountId({ ctx, userAccountId })
      },
    }
  },
  primary(ctx) {
    return {
      async anyUser() {
        return {
          async moduleInfo() {
            const {
              configs: { userAccountPrimaryMsgSchemaConfigs },
            } = await ctx.mod.secondary.env.query.modConfigs({ mod: 'userAccount' })
            return { schemaConfigs: userAccountPrimaryMsgSchemaConfigs }
          },
          async getUserSession() {
            const userSession = await validateCurrentUserSession({ ctx })
            return { userSession }
          },
        }
      },

      //get admin(){ check () return { ... } }
      async admin() {
        const adminUserSession = await assert_authorizeCurrentUserSessionWithRole({
          ctx,
          role: 'admin',
        })
        const adminUserAccountId = adminUserSession.user.id
        return {
          async editUserRoles({ userAccountId, role, action }) {
            const [found, user] = await ctx.mod.secondary.userAccount.query.userBy({ by: 'id', userAccountId })
            if (!found) {
              return [false, { reason: 'userNotFound' }]
            }

            const new_roles_set = new Set(user.roles)
            new_roles_set[action === 'set' ? 'add' : 'delete'](role)
            const new_roles = (
              new_roles_set.has('admin') ? (['admin', 'contributor'] satisfies userRole[]) : Array.from(new_roles_set)
            ).sort()

            const [done] = await ctx.write.setUserRoles({
              userAccountId,
              roles: new_roles,
              adminUserAccountId: adminUserSession.user.id,
            })
            if (!done) {
              return [false, { reason: 'userNotFound' }]
            }
            return [true, { updatedRoles: new_roles, adminUserAccountId }]
          },

          async searchUsers({ textSearch }) {
            const { userAccountRecords: users } = await ctx.mod.secondary.userAccount.query.usersByText({
              text: textSearch,
            })
            return { users }
          },

          async deactivateUser({ userAccountId, anonymize, reason }) {
            const [done] = await ctx.write.deactivateUser({
              userAccountId,
              reason: {
                type: 'adminRequest',
                adminUserAccountId: adminUserSession.user.id,
                reason,
              },
              anonymize,
            })
            if (!done) {
              return [false, { reason: 'userNotFound' }]
            }
            return [true, { adminUserAccountId }]
          },
        }
      },
      async signedTokenAccess() {
        return {
          async createNewUserByEmailVerificationToken({ signupEmailVerificationToken }) {
            const {
              configs: {
                roles: { newlyCreatedUserRoles },
              },
            } = await ctx.mod.secondary.env.query.modConfigs({ mod: 'userAccount' })
            const [verified, validation] = await ctx.mod.secondary.crypto.service.validateSignedToken({
              token: signupEmailVerificationToken,
              module: 'userAccount',
              type: 'signupRequestEmailVerification',
            })

            if (!verified) {
              return [false, { reason: 'invalidToken' }]
            }
            const { validatedSignedTokenData } = validation
            const [, foundSameEmailUser] = await ctx.mod.secondary.userAccount.query.userBy({
              by: 'email',
              email: validatedSignedTokenData.email,
            })

            if (foundSameEmailUser) {
              return [false, { reason: 'userWithThisEmailExists' }]
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
            if (!newUserCreated) {
              return [false, { reason: 'unknown' }]
            }

            return [true, { userAccountId: newUser.id }]
          },
          async resetPassword({ resetPasswordForm: { newPassword, token } }) {
            const [verified, validation] = await ctx.mod.secondary.crypto.service.validateSignedToken({
              token,
              module: 'userAccount',
              type: 'resetPasswordRequest',
            })

            if (!verified) {
              return [false, { reason: 'invalidToken' }]
            }

            const { validatedSignedTokenData } = validation
            const [found, userAccountRecord] = await ctx.mod.secondary.userAccount.query.userBy({
              by: 'email',
              email: validatedSignedTokenData.email,
            })
            if (!found) {
              return [false, { reason: 'userNotFound' }]
            }
            const { passwordHash } = await ctx.mod.secondary.crypto.service.hashPassword({
              plainPassword: newPassword,
            })
            const [pwdChanged] = await ctx.write.setUserPassword({
              newPasswordHash: passwordHash,
              userAccountId: userAccountRecord.id,
            })
            return pwdChanged ? [true, _void] : [false, { reason: 'unknown' }]
          },
          async confirmSelfDeletionRequest({ selfDeletionConfirmationToken, reason }) {
            const [verified, validation] = await ctx.mod.secondary.crypto.service.validateSignedToken({
              token: selfDeletionConfirmationToken,
              module: 'userAccount',
              type: 'selfDeletionRequestConfirm',
            })

            if (!verified) {
              return [false, { reason: 'invalidToken' }]
            }
            const { validatedSignedTokenData } = validation

            const [user] = await ctx.mod.secondary.userAccount.query.userBy({
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
        }
      },
      async unauthenticated() {
        return {
          async signupRequest({ signupForm, redirectUrl }) {
            const schemas = await fetchPrimarySchemas()
            const { displayName, email, password } = schemas.signupSchema.parse(signupForm)
            const [found] = await ctx.mod.secondary.userAccount.query.userBy({ by: 'email', email })
            if (found) {
              return [false, { reason: 'userWithSameEmailExists' }]
            }
            const {
              configs: { tokenExpireTime },
            } = await ctx.mod.secondary.env.query.modConfigs({ mod: 'userAccount' })

            const { passwordHash } = await ctx.mod.secondary.crypto.service.hashPassword({
              plainPassword: password,
            })

            const confirmEmailSession = await ctx.mod.secondary.crypto.service.signDataToken({
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
            ctx.mod.secondary.userNotification.service.enqueueNotificationToUser({
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

          async login({ loginForm }) {
            const [found, userAccountRecord] = await ctx.mod.secondary.userAccount.query.userBy({
              by: 'email',
              email: loginForm.email,
            })
            if (!(found && !userAccountRecord.deactivated)) {
              return [false, _void]
            }
            const [verified] = await ctx.mod.secondary.crypto.service.verifyPasswordHash({
              plainPassword: loginForm.password,
              passwordHash: userAccountRecord.passwordHash,
            })

            if (!verified) {
              return [false, _void]
            }

            const [sessionCreated, sessionResult] = await generateSessionForUserAccountId({
              ctx,
              userAccountId: userAccountRecord.id,
            })
            if (!sessionCreated) {
              return [false, _void]
            }
            return [true, { sessionToken: sessionResult.userSessionToken }]
          },
          async resetPasswordRequest({ declaredOwnEmail, redirectUrl }) {
            const {
              configs: { tokenExpireTime: userSelfDeletion },
            } = await ctx.mod.secondary.env.query.modConfigs({ mod: 'userAccount' })

            const [, user] = await ctx.mod.secondary.userAccount.query.userBy({
              by: 'email',
              email: declaredOwnEmail,
            })
            if (!user) {
              return
            }

            const resetPasswordConfirmationSession = await ctx.mod.secondary.crypto.service.signDataToken({
              expiresIn: userSelfDeletion.resetPasswordRequest,
              data: {
                module: 'userAccount',
                type: 'resetPasswordRequest',
                redirectUrl,
                email: user.contacts.email,
              },
            })

            ctx.mod.secondary.userNotification.service.enqueueNotificationToUser({
              data: {
                module: 'userAccount',
                type: 'resetPasswordRequest',
                resetPasswordUrl: url_string_schema.parse(`${redirectUrl}?token=${resetPasswordConfirmationSession.token}`),
                toUserAccountId: user.id,
              },
            })
            return
          },
        }
      },

      async authenticated() {
        const authenticatedSession = await assert_authorizeAuthenticatedCurrentUserSession({ ctx })
        const userAccountId = authenticatedSession.user.id

        const authenticatedPrimary: primary['authenticated'] = {
          async invalidateSession(/* {sessionToken} */) {
            // TODO implement session_token invalidation
            //! -------------------------------------
            return {userAccountId}
          },
          async selfDeletionRequest({ redirectUrl }) {
            const {
              configs: { tokenExpireTime: userSelfDeletion },
            } = await ctx.mod.secondary.env.query.modConfigs({ mod: 'userAccount' })
            const selfDeletionConfirmationSession = await ctx.mod.secondary.crypto.service.signDataToken({
              expiresIn: userSelfDeletion.userSelfDeletionRequest,
              data: {
                module: 'userAccount',
                type: 'selfDeletionRequestConfirm',
                redirectUrl,
                userAccountId,
              },
            })

            ctx.mod.secondary.userNotification.service.enqueueNotificationToUser({
              data: {
                module: 'userAccount',
                type: 'deleteAccountRequest',
                deleteAccountUrl: url_string_schema.parse(`${redirectUrl}?token=${selfDeletionConfirmationSession.token}`),
                toUserAccountId: userAccountId,
              },
            })
            return { userAccountId }
          },

          async changePassword({ currentPassword, newPassword }) {
            const [, user] = await ctx.mod.secondary.userAccount.query.userBy({
              by: 'id',
              userAccountId,
            })
            if (!user) {
              return [false, { reason: 'unknown' }]
            }
            const [currentPasswordVerified] = await ctx.mod.secondary.crypto.service.verifyPasswordHash({
              plainPassword: currentPassword,
              passwordHash: user.passwordHash,
            })
            if (!currentPasswordVerified) {
              return [false, { reason: 'wrongCurrentPassword' }]
            }
            const { passwordHash } = await ctx.mod.secondary.crypto.service.hashPassword({
              plainPassword: newPassword,
            })
            const [done] = await ctx.write.setUserPassword({
              newPasswordHash: passwordHash,
              userAccountId,
            })

            if (!done) {
              return [false, { reason: 'unknown' }]
            }

            return [true, { userAccountId }]
          },
          async getMyUserAccountRecord() {
            const [found, userAccountRecord] = await ctx.mod.secondary.userAccount.query.userBy({
              by: 'id',
              userAccountId: authenticatedSession.user.id,
            })
            assert(found, `authenticated user ${authenticatedSession.user.id}} not found`)
            return userAccountRecord
          },
        }
        return authenticatedPrimary
      },
    }
    async function fetchPrimarySchemas() {
      const {
        configs: { userAccountPrimaryMsgSchemaConfigs },
      } = await ctx.mod.secondary.env.query.modConfigs({ mod: 'userAccount' })
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
              ctx.mod.secondary.userNotification.service.enqueueNotificationToUser({
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
              const [found, response] = await ctx.mod.secondary.userProfile.query.getUserProfile({
                by: 'userProfileId',
                userProfileId,
              })
              if (!found) {
                return
              }
              await ctx.sync.userDisplayname({
                displayName,
                userAccountId: response.userProfileRecord.userAccount.id,
              })
            },
          },
        },
      },
    }
  },
  async startBackgroundProcess(ctx) {
    ctx.log('debug', 'Starting background process userAccount')
    const sysAdminInfo = await ctx.mod.secondary.env.query.getSysAdminInfo()
    ctx.log('debug', `Checking if sysAdmin user exists: `, { sysAdminInfo })

    const [found] = await ctx.mod.secondary.userAccount.query.userBy({
      by: 'email',
      email: sysAdminInfo.email,
    })

    if (!found) {
      const { passwordHash } = await ctx.mod.secondary.crypto.service.hashPassword({
        plainPassword: __redacted__(await generateNanoId({ length: 20 })),
      })
      const newUser = await createNewUserAccountRecordData({
        displayName: 'Admin',
        email: sysAdminInfo.email,
        passwordHash,
        roles: ['admin', 'contributor'],
      })

      await ctx.write.saveNewUser({ newUser })
    }
  },
}
