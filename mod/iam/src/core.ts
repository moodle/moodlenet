import { iam, moodle_core_context, moodle_core_factory, moodle_core_impl } from '@moodle/domain'
import {
  resetPasswordEmail,
  selfDeletionConfirmEmail,
  signupEmailConfirmationEmail,
} from '@moodle/lib-email-templates/iam'
import { generateNanoId } from '@moodle/lib-id-gen'
import { __redacted__, _void, date_time_string } from '@moodle/lib-types'
import { user_role } from 'domain/src/iam'
import * as lib from './lib'

export function iam_core(): moodle_core_factory {
  return ctx => {
    const core_impl: moodle_core_impl = {
      primary: {
        iam: {
          system: {
            async configs() {
              await lib.assert_authorizeSystemSession(ctx)
              return ctx.sys_call.secondary.iam.db.getConfigs()
            },
          },
          session: {
            async getCurrentUserSession() {
              const userSession = await lib.validateAnyUserSession(ctx)
              return { userSession }
            },
            async generateUserSession({ userId }) {
              return lib.generateSessionForUserId(ctx, userId)
            },
          },

          //get admin():moodle_iam_mod['v1_0']['pri']['admin'] {
          admin: {
            async editUserRoles({ userId, role, action }) {
              const admin_user_session = await lib.assert_authorizeAdminUserSession(ctx)
              const [found, user] = await ctx.sys_call.secondary.iam.db.getUserById({ userId })
              if (!found) {
                return [false, { reason: 'userNotFound' }]
              }

              const new_roles_set = new Set(user.roles)
              new_roles_set[action === 'set' ? 'add' : 'delete'](role)
              const new_roles = (
                new_roles_set.has('admin')
                  ? (['admin', 'publisher'] satisfies user_role[])
                  : Array.from(new_roles_set)
              ).sort()

              const [done] = await ctx.sys_call.secondary.iam.db.setUserRoles({
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
              await lib.assert_authorizeAdminUserSession(ctx)
              const { users } = await ctx.sys_call.secondary.iam.db.findUsersByText({
                text: textSearch,
              })
              return { users }
            },

            async deactivateUser({ userId, anonymize, reason }) {
              const admin_user_session = await lib.assert_authorizeAdminUserSession(ctx)
              const [done] = await ctx.sys_call.secondary.iam.db.deactivateUser({
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
              const [found] = await ctx.sys_call.secondary.iam.db.getUserByEmail({
                email,
              })
              if (found) {
                return [false, { reason: 'userWithSameEmailExists' }]
              }
              const {
                configs: { tokenExpireTime },
              } = await ctx.sys_call.secondary.iam.db.getConfigs()

              const { passwordHash } = await ctx.sys_call.secondary.iam.crypto.hashPassword({
                plainPassword: password,
              })

              const confirmEmailSession = await ctx.sys_call.secondary.iam.crypto.signDataToken({
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

              await ctx.sys_call.secondary.iam.email.sendNow({
                reactBody,
                subject: emailProps.content.subject,
                to: signupForm.email,
              })
              return [true, _void]
            },

            async createNewUserByEmailVerificationToken({ signupEmailVerificationToken }) {
              const {
                configs: {
                  roles: { newlyCreatedUserRoles },
                },
              } = await ctx.sys_call.secondary.iam.db.getConfigs()
              const [verified, validation] =
                await ctx.sys_call.secondary.iam.crypto.validateSignedToken({
                  token: signupEmailVerificationToken,
                  type: 'signupRequestEmailVerification',
                })

              if (!verified) {
                return [false, { reason: 'invalidToken' }]
              }
              const { validatedSignedTokenData } = validation
              const [, foundSameEmailUser] = await ctx.sys_call.secondary.iam.db.getUserByEmail({
                email: validatedSignedTokenData.email,
              })

              if (foundSameEmailUser) {
                return [true, { userId: foundSameEmailUser.id }]
              }

              const now = date_time_string('now')
              const newUser = await lib.createNewUserRecordData({
                createdAt: now,
                roles: newlyCreatedUserRoles,
                displayName: validatedSignedTokenData.displayName,
                email: validatedSignedTokenData.email,
                passwordHash: validatedSignedTokenData.passwordHash,
                lastLogin: now,
              })
              const [newUserCreated] = await ctx.sys_call.secondary.iam.db.saveNewUser({
                newUser,
              })
              return newUserCreated
                ? [true, { userId: newUser.id }]
                : [false, { reason: 'unknown' }]
            },
            async login({ loginForm }) {
              const [found, user_record] = await ctx.sys_call.secondary.iam.db.getUserByEmail({
                email: loginForm.email,
              })
              if (!(found && !user_record.deactivated)) {
                return [false, _void]
              }
              const [verified] = await ctx.sys_call.secondary.iam.crypto.verifyUserPasswordHash({
                plainPassword: loginForm.password,
                passwordHash: user_record.passwordHash,
              })

              if (!verified) {
                return [false, _void]
              }

              const user = lib.user_record2SessionUserData(user_record)
              const session = await lib.generateSessionForUserData(ctx, user)
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
              } = await ctx.sys_call.secondary.iam.db.getConfigs()

              const [, user] = await ctx.sys_call.secondary.iam.db.getUserByEmail({
                email: declaredOwnEmail,
              })
              if (!user) {
                return
              }

              const resetPasswordConfirmationSession =
                await ctx.sys_call.secondary.iam.crypto.signDataToken({
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
              await ctx.sys_call.secondary.iam.email.sendNow({
                reactBody,
                subject: emailProps.content.subject,
                to: lib.getUserNamedEmailAddress(user),
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
              const authenticated_session = await lib.assert_authorizeAuthenticatedUserSession(ctx)
              const {
                configs: { tokenExpireTime: userSelfDeletion },
              } = await ctx.sys_call.secondary.iam.db.getConfigs()

              const selfDeletionConfirmationSession =
                await ctx.sys_call.secondary.iam.crypto.signDataToken({
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
              await ctx.sys_call.secondary.iam.email.sendNow({
                reactBody,
                subject: emailProps.content.subject,
                to: lib.getUserNamedEmailAddress(authenticated_session.user),
              })
              return
            },

            async confirmSelfDeletionRequest({ selfDeletionConfirmationToken, reason }) {
              const [verified, validation] =
                await ctx.sys_call.secondary.iam.crypto.validateSignedToken({
                  token: selfDeletionConfirmationToken,
                  type: 'selfDeletionRequestConfirm',
                })

              if (!verified) {
                return [false, { reason: 'invalidToken' }]
              }
              const { validatedSignedTokenData } = validation

              const [user] = await ctx.sys_call.secondary.iam.db.getUserById({
                userId: validatedSignedTokenData.userId,
              })
              if (!user) {
                return [false, { reason: 'unknownUser' }]
              }

              const [deactivated] = await ctx.sys_call.secondary.iam.db.deactivateUser({
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
              const [verified, validation] =
                await ctx.sys_call.secondary.iam.crypto.validateSignedToken({
                  token,
                  type: 'resetPasswordRequest',
                })

              if (!verified) {
                return [false, { reason: 'invalidToken' }]
              }

              const { validatedSignedTokenData } = validation
              const [found, user_record] = await ctx.sys_call.secondary.iam.db.getUserByEmail({
                email: validatedSignedTokenData.email,
              })
              if (!found) {
                return [false, { reason: 'userNotFound' }]
              }
              const { passwordHash } = await ctx.sys_call.secondary.iam.crypto.hashPassword({
                plainPassword: newPassword,
              })
              const [pwdChanged] = await ctx.sys_call.secondary.iam.db.setUserPassword({
                newPasswordHash: passwordHash,
                userId: user_record.id,
              })
              return pwdChanged ? [true, _void] : [false, { reason: 'unknown' }]
            },

            async changePassword({ currentPassword, newPassword }) {
              const authenticated_session = await lib.assert_authorizeAuthenticatedUserSession(ctx)

              const [, user] = await ctx.sys_call.secondary.iam.db.getUserById({
                userId: authenticated_session.user.id,
              })
              if (!user) {
                return [false, { reason: 'unknown' }]
              }
              const [currentPasswordVerified] =
                await ctx.sys_call.secondary.iam.crypto.verifyUserPasswordHash({
                  plainPassword: currentPassword,
                  passwordHash: user.passwordHash,
                })
              if (!currentPasswordVerified) {
                return [false, { reason: 'wrongCurrentPassword' }]
              }
              const { passwordHash } = await ctx.sys_call.secondary.iam.crypto.hashPassword({
                plainPassword: newPassword,
              })
              await ctx.sys_call.secondary.iam.db.setUserPassword({
                newPasswordHash: passwordHash,
                userId: authenticated_session.user.id,
              })
              return [true, _void]
            },
          },
        },
      },
      event: {
        env: {
          system: {
            // BEWARE:these messages are manually crafted: no type-checking here
            // and should be maintained aligned with be/default/src/default-session-deployment.ts#startBackgroundProcesses
            // at least until we have a better way to generate them

            async backgroundProcess({ action }) {
              console.log('event backgroundProcess IAM')
              if (action === 'start') {
                startIamProcess(ctx)
              }
            },
          },
        },
      },
      watch: {
        secondary: {
          userHome: {
            db: {
              async updatePartialProfileInfo([
                [done, res],
                {
                  partialProfileInfo: { displayName },
                },
              ]) {
                if (!done || typeof displayName !== 'string') {
                  return
                }

                await ctx.sys_call.secondary.iam.alignDb.userDisplayname({
                  displayName,
                  userId: res.userId,
                })
              },
            },
          },
        },
      },
    }
    return core_impl
    async function fetchPrimarySchemas() {
      const {
        configs: { iamPrimaryMsgSchemaConfigs },
      } = await ctx.sys_call.secondary.iam.db.getConfigs()
      return iam.getIamPrimarySchemas(iamPrimaryMsgSchemaConfigs)
    }
  }

  async function startIamProcess(ctx: moodle_core_context) {
    const sysAdminInfo = await ctx.sys_call.primary.env.maintainance.getSysAdminInfo()
    const [found] = await ctx.sys_call.secondary.iam.db.getUserByEmail({
      email: sysAdminInfo.email,
    })

    if (!found) {
      const { passwordHash } = await ctx.sys_call.secondary.iam.crypto.hashPassword({
        plainPassword: __redacted__(await generateNanoId({ length: 20 })),
      })
      const newUser = await lib.createNewUserRecordData({
        displayName: 'Admin',
        email: sysAdminInfo.email,
        passwordHash,
        roles: ['admin', 'publisher'],
      })

      await ctx.sys_call.secondary.iam.db.saveNewUser({ newUser })
    }
  }
}
