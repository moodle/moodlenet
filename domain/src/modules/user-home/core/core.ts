import { generateNanoId } from '@moodle/lib-id-gen'
import { _unchecked_brand, _void } from '@moodle/lib-types'
import { assertWithErrorXxx, moduleCore } from '../../../types'
import { assert_authorizeAuthenticatedUserSession } from '../../iam/lib'
import { usingTempFile2asset } from '../../storage/lib'
import { accessUserHome } from '../lib'
import { user_home_record } from '../types'

export const user_home_core: moduleCore<'userHome'> = {
  modName: 'userHome',
  primary(ctx) {
    return {
      session: {
        async moduleInfo() {
          const {
            configs: { profileInfoPrimaryMsgSchemaConfigs },
          } = await ctx.mod.env.query.modConfigs({ mod: 'userHome' })
          return { schemaConfigs: profileInfoPrimaryMsgSchemaConfigs }
        },
      },
      editProfile: {
        async useTempImageAsProfileImage({ as, tempId }) {
          const { user } = await assert_authorizeAuthenticatedUserSession({ ctx })
          const userHome = await accessUserHome({
            ctx,
            by: { idOf: 'user', user_id: user.id },
          })
          assertWithErrorXxx(
            userHome.result === 'found' && userHome.access === 'allowed' && userHome.permissions.editProfile,
            'Unauthorized',
          )
          const [done, result] = await ctx.write.useTempImageInProfile({
            as,
            id: userHome.id,
            tempId,
          })
          if (!done) {
            return [false, result]
          }
          return [true, result]
        },
        async editProfileInfo({ user_home_id, profileInfo }) {
          const userHome = await accessUserHome({ ctx, by: { idOf: 'user_home', user_home_id } })
          if (userHome.result === 'notFound') {
            return [false, { reason: 'notFound' }]
          }
          assertWithErrorXxx(userHome.access === 'allowed' && userHome.permissions.editProfile, 'Unauthorized')
          const [done] = await ctx.write.updatePartialProfileInfo({
            id: user_home_id,
            partialProfileInfo: profileInfo,
          })
          if (!done) {
            return [false, { reason: 'unknown' }]
          }
          return [done, _void]
        },
      },
      userHome: {
        async access({ by }) {
          const userHomeResult = await accessUserHome({ ctx, by })

          if (userHomeResult.result === 'notFound' || userHomeResult.access === 'notAllowed') {
            return [false, { reason: 'notFound' }]
          }
          return [true, { accessObject: userHomeResult }]
        },
      },
    }
  },
  watch(ctx) {
    return {
      secondary: {
        userHome: {
          write: {
            async useTempImageInProfile([[done, usingTempFile], { id, as }]) {
              if (!done) {
                return
              }
              const asset = usingTempFile2asset(usingTempFile)
              await ctx.write.updatePartialProfileInfo({
                id,
                partialProfileInfo: as === 'avatar' ? { avatar: asset } : as === 'background' ? { background: asset } : {},
              })
            },
          },
        },
        iam: {
          write: {
            //REVIEW - this iam should emit an event and catch it here  in userhome
            async saveNewUser([[created, resp], { newUser }]) {
              ctx.log('debug', 'user-home watch saveNewUser', { created, resp, newUser })
              if (!created) {
                return
              }
              const user_home_id = await generateNanoId()
              ctx.write.createUserHome({
                userHome: _unchecked_brand<user_home_record>({
                  id: user_home_id,
                  user: {
                    id: newUser.id,
                    roles: newUser.roles,
                  },
                  profileInfo: {
                    displayName: newUser.displayName,
                    aboutMe: '',
                    location: '',
                    siteUrl: null,
                    avatar: null,
                    background: null,
                  },
                }),
              })
            },

            async setUserRoles([[done, result], { userId }]) {
              if (!done) {
                return
              }
              await ctx.sync.userExcerpt({
                userExcerpt: { id: userId, roles: result.newRoles },
              })
            },
          },
        },
      },
    }
  },
}
