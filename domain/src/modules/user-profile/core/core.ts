import { generateNanoId } from '@moodle/lib-id-gen'
import { _void, webSlug } from '@moodle/lib-types'
import { assertWithErrorXxx, moduleCore } from '../../../types'
import { validateCurrentUserAuthenticatedSessionHasRole } from '../../user-account/lib'
import { usingTempFile2asset } from '../../storage/lib'
import { accessUserProfile } from '../lib'

export const user_profile_core: moduleCore<'userProfile'> = {
  modName: 'userProfile',
  primary(ctx) {
    return {
      session: {
        async moduleInfo() {
          const {
            configs: { profileInfoPrimaryMsgSchemaConfigs },
          } = await ctx.mod.env.query.modConfigs({ mod: 'userProfile' })
          return { schemaConfigs: profileInfoPrimaryMsgSchemaConfigs }
        },
      },
      editProfile: {
        async useTempImageAsProfileImage({ as, tempId, userProfileId }) {
          const userProfile = await accessUserProfile({
            ctx,
            by: { idOf: 'userProfile', userProfileId },
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
          const userProfile = await accessUserProfile({ ctx, by: { idOf: 'userProfile', userProfileId: userProfileId } })
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
      userProfile: {
        async access({ by }) {
          if (by.idOf === 'user' && !(await validateCurrentUserAuthenticatedSessionHasRole({ ctx, role: 'admin' }))) {
            return [false, { reason: 'notFound' }]
          }
          const userProfileResult = await accessUserProfile({ ctx, by })

          if (userProfileResult.result === 'notFound' || userProfileResult.access === 'notAllowed') {
            return [false, { reason: 'notFound' }]
          }
          return [true, { accessObject: userProfileResult }]
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
                partialUserProfile: { urlSafeProfileName: webSlug(displayName) },
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
              const userProfileId = await generateNanoId()
              ctx.queue.createUserProfile({
                userProfile: {
                  id: userProfileId,
                  userAccountUser: {
                    id: newUser.id,
                    roles: newUser.roles,
                  },
                  urlSafeProfileName: webSlug(newUser.displayName),
                  info: {
                    displayName: newUser.displayName,
                    aboutMe: '',
                    location: '',
                    siteUrl: null,
                    avatar: null,
                    background: null,
                  },
                },
              })
            },

            async setUserRoles([[done, result], { userId }]) {
              if (!done) {
                return
              }
              await ctx.sync.userAccountUserExcerpt({
                userAccountUserExcerpt: { id: userId, roles: result.newRoles },
              })
            },
          },
        },
      },
    }
  },
}
