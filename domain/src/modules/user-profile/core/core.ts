import { _void, webSlug } from '@moodle/lib-types'
import { assertWithErrorXxx, moduleCore } from '../../../types'
import { usingTempFile2asset } from '../../storage/lib'
import {
  userSessionInfo,
  validateCurrentUserAuthenticatedSessionHasRole,
  validateCurrentUserSession,
} from '../../user-account/lib'
import { accessUserProfile } from '../lib'
import { createNewUserProfileData } from './lib/new-user-profile'

export const user_profile_core: moduleCore<'userProfile'> = {
  modName: 'userProfile',
  service() {
    return
  },
  primary(ctx) {
    ctx.from
    return {
      session: {
        async moduleInfo() {
          const {
            configs: { profileInfoPrimaryMsgSchemaConfigs },
          } = await ctx.mod.secondary.env.query.modConfigs({ mod: 'userProfile' })
          return { schemaConfigs: profileInfoPrimaryMsgSchemaConfigs }
        },
      },
      editProfile: {
        async useTempImageAsProfileImage({ as, tempId, userProfileId }) {
          const userProfile = await accessUserProfile({
            ctx,
            by: 'userProfileId',
            userProfileId,
          })
          assertWithErrorXxx(
            userProfile.result === 'found' && userProfile.access === 'allowed' && userProfile.permissions.editProfile,
            'Unauthorized',
          )
          const [done, result] = await ctx.write.useTempImageInProfile({
            as,
            id: userProfile.id,
            tempId,
          })
          if (!done) {
            return [false, result]
          }
          return [true, result]
        },
        async editProfileInfo({ userProfileId, profileInfo }) {
          const userProfile = await accessUserProfile({ ctx, by: 'userProfileId', userProfileId: userProfileId })
          if (userProfile.result === 'notFound') {
            return [false, { reason: 'notFound' }]
          }
          assertWithErrorXxx(userProfile.access === 'allowed' && userProfile.permissions.editProfile, 'Unauthorized')
          const [done] = await ctx.write.updatePartialProfileInfo({
            userProfileId: userProfileId,
            partialProfileInfo: profileInfo,
          })
          if (!done) {
            return [false, { reason: 'unknown' }]
          }
          return [done, _void]
        },
      },
      access: {
        async byId(get) {
          if (
            get.by === 'userAccountId' &&
            !(await validateCurrentUserAuthenticatedSessionHasRole({ ctx, role: 'admin' }))
          ) {
            return [false, { reason: 'notFound' }]
          }
          const userProfileResult = await accessUserProfile({ ctx, ...get })

          if (userProfileResult.result === 'notFound' || userProfileResult.access === 'notAllowed') {
            return [false, { reason: 'notFound' }]
          }
          return [true, { accessObject: userProfileResult }]
        },
      },
      me: {
        async getMyProfile() {
          const userSession = await validateCurrentUserSession({ ctx })
          const sessionInfo = userSessionInfo(userSession)
          if (!sessionInfo.authenticated) {
            return [false, { reason: 'unauthenticated' }]
          }
          const userAccountId = sessionInfo.authenticated.user.id
          const [found, result] = await ctx.mod.secondary.userProfile.query.getUserProfile({
            by: 'userAccountId',
            userAccountId,
          })
          if (!found) {
            const errMsg = `couldn't find userProfile for userAccountId: ${userAccountId}, despite has authenticated sessionInfo`
            ctx.log('critical', errMsg, sessionInfo)
            throw new Error(errMsg)
          }
          return [true, { userProfileRecord: result.userProfileRecord }]
        },
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
            async updatePartialProfileInfo([
              [done],
              {
                userProfileId,
                partialProfileInfo: { displayName },
              },
            ]) {
              if (!done || !displayName) {
                return
              }
              await ctx.write.updatePartialUserProfile({
                userProfileId,
                partialUserProfile: { appData: { urlSafeProfileName: webSlug(displayName) } },
              })
            },
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
              ctx.write.createUserProfile({ userProfileRecord: await createNewUserProfileData({ newUser, ctx }) })
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
