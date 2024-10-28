import { _void } from '@moodle/lib-types'
import { omit } from 'lodash'
import { userProfilePrimary } from '..'
import { assertWithErrorXxx, moduleCore } from '../../../types'
import { usingTempFile2asset } from '../../storage/lib'
import {
  assert_authorizeAuthenticatedCurrentUserSession,
  assert_authorizeCurrentUserSessionWithRole,
} from '../../user-account/lib'
import { createNewUserProfileData } from './lib/new-user-profile'

export const user_profile_core: moduleCore<'userProfile'> = {
  modName: 'userProfile',
  service() {
    return
  },
  primary(ctx) {
    return {
      session: {
        async moduleInfo() {
          const {
            configs: { profileInfoPrimaryMsgSchemaConfigs },
          } = await ctx.mod.secondary.env.query.modConfigs({ mod: 'userProfile' })
          return { schemaConfigs: profileInfoPrimaryMsgSchemaConfigs }
        },
      },
      get me() {
        const accessCheckP = assert_authorizeAuthenticatedCurrentUserSession({ ctx }).then(async authenticatedUser => {
          const userProfileId = authenticatedUser.profile.id
          const [found, userProfileResult] = await ctx.mod.secondary.userProfile.query.getUserProfile({
            by: 'userProfileId',
            userProfileId,
          })
          assertWithErrorXxx(found, 'Not Found', 'authenticated userProfileRecord not found')
          return userProfileResult
        })
        const primaries: userProfilePrimary['me'] = {
          async getMyUserRecords() {
            const { userProfileRecord } = await accessCheckP
            const userAccontRecord = await ctx.forward.userAccount.authenticated.get()
            return {
              userProfileRecord: omit(userProfileRecord, 'userAccount'),
              userAccountRecord: omit(userAccontRecord, 'displayName'),
            }
          },
          async useTempImageAsProfileImage({ as, tempId }) {
            const { userProfileRecord } = await accessCheckP
            const [done, result] = await ctx.write.useTempImageInProfile({
              as,
              id: userProfileRecord.id,
              tempId,
            })
            if (!done) {
              return [false, result]
            }
            return [true, result]
          },
          async editProfileInfo({ profileInfo }) {
            const { userProfileRecord } = await accessCheckP
            const [done] = await ctx.write.updatePartialProfileInfo({
              userProfileId: userProfileRecord.id,
              partialProfileInfo: profileInfo,
            })
            if (!done) {
              return [false, { reason: 'unknown' }]
            }
            return [done, _void]
          },
        }
        return primaries
      },
      get admin() {
        const accessCheckP = assert_authorizeCurrentUserSessionWithRole({ ctx, role: 'admin' }).then(
          async authenticatedAdminUser => {
            return authenticatedAdminUser
          },
        )

        const adminPrimary: userProfilePrimary['admin'] = {
          async byId(get) {
            await accessCheckP
            const [found, userProfileResult] = await ctx.mod.secondary.userProfile.query.getUserProfile({ ...get })

            if (!found) {
              return [false, { reason: 'notFound' }]
            }
            return [true, { userProfileRecord: userProfileResult.userProfileRecord }]
          },
        }
        return adminPrimary
      },
    }
  },
  watch(ctx) {
    return {
      secondary: {
        userProfile: {
          write: {
            async useTempImageInProfile([[done, usingTempFile], { id, as }]) {
              if (!done) {
                return
              }
              const asset = usingTempFile2asset(usingTempFile)
              await ctx.write.updatePartialProfileInfo({
                userProfileId: id,
                partialProfileInfo: as === 'avatar' ? { avatar: asset } : as === 'background' ? { background: asset } : {},
              })
            },
            // async updatePartialProfileInfo([
            //   [done],
            //   {
            //     userProfileId,
            //     partialProfileInfo: { displayName },
            //   },
            // ]) {
            //   if (!done || !displayName) {
            //     return
            //   }
            //   await ctx.write.updatePartialUserProfile({
            //     userProfileId,
            //     partialUserProfile: { appData: { urlSafeProfileName: webSlug(displayName) } },
            //   })
            // },
          },
        },
        userAccount: {
          write: {
            //REVIEW - this userAccount should emit an event and catch it here  in userprofile
            async saveNewUser([[created, resp], { newUser }]) {
              ctx.log('debug', 'user-profile watch saveNewUser', { created, resp, newUser })
              if (!created) {
                return
              }
              ctx.write.createUserProfile({ userProfileRecord: await createNewUserProfileData({ newUser }) })
            },

            async setUserRoles([[done, result], { userAccountId }]) {
              if (!done) {
                return
              }
              await ctx.sync.userAccountExcerpt({
                userAccountExcerpt: { id: userAccountId, roles: result.newRoles },
              })
            },
          },
        },
      },
    }
  },
}
