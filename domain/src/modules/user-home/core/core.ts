import { generateNanoId } from '@moodle/lib-id-gen'
import { _unchecked_brand, _void } from '@moodle/lib-types'
import { assertWithErrorXxx, coreBootstrap } from '../../../types'
import { assert_authorizeAuthenticatedUserSession } from '../../iam/lib'
import { accessUserHome } from '../lib'
import { user_home_record } from '../types'
import { asset, uploaded_blob_meta_2_asset } from '../../storage'

export const user_home_core: coreBootstrap<'userHome'> = ({ log }) => {
  return {
    modName: 'userHome',
    provider(coreCtx) {
      return {
        primary(priCtx) {
          return {
            session: {
              async moduleInfo() {
                const {
                  configs: { profileInfoPrimaryMsgSchemaConfigs },
                } = await coreCtx.mod.env.query.modConfigs({ mod: 'userHome' })
                return { schemaConfigs: profileInfoPrimaryMsgSchemaConfigs }
              },
            },
            editProfile: {
              async useTempImageAsProfileImage({ as, tempId }) {
                const { user } = await assert_authorizeAuthenticatedUserSession({ coreCtx, priCtx })
                const userHome = await accessUserHome({
                  coreCtx,
                  priCtx,
                  by: { idOf: 'user', user_id: user.id },
                })
                assertWithErrorXxx(
                  userHome.result === 'found' && userHome.access === 'allowed' && userHome.permissions.editProfile,
                  'Unauthorized',
                )
                const [done, result] = await coreCtx.write.useTempImageInProfile({
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
                const userHome = await accessUserHome({
                  coreCtx,
                  priCtx,
                  by: { idOf: 'user_home', user_home_id },
                })
                if (userHome.result === 'notFound') {
                  return [false, { reason: 'notFound' }]
                }
                assertWithErrorXxx(userHome.access === 'allowed' && userHome.permissions.editProfile, 'Unauthorized')
                const [done] = await coreCtx.write.updatePartialProfileInfo({
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
                const userHomeResult = await accessUserHome({ priCtx, coreCtx, by })

                if (userHomeResult.result === 'notFound' || userHomeResult.access === 'notAllowed') {
                  return [false, { reason: 'notFound' }]
                }
                return [true, { accessObject: userHomeResult }]
              },
            },
          }
        },
        watch(watchCtx) {
          return {
            secondary: {
              userHome: {
                write: {
                  async useTempImageInProfile([[done, usingTempFile], { id, as }]) {
                    if (!done) {
                      return
                    }
                    const asset = uploaded_blob_meta_2_asset(usingTempFile)
                    await coreCtx.write.updatePartialProfileInfo({
                      id,
                      partialProfileInfo:
                        as === 'avatar' ? { avatar: asset } : as === 'background' ? { background: asset } : {},
                    })
                  },
                },
              },
              iam: {
                write: {
                  //REVIEW - this iam should emit an event and catch it here  in userhome
                  async saveNewUser([[created, resp], { newUser }]) {
                    log('debug', 'user-home watch saveNewUser', { created, resp, newUser })
                    if (!created) {
                      return
                    }
                    const user_home_id = await generateNanoId()
                    return coreCtx.write.createUserHome({
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
                    await watchCtx.sync.userExcerpt({
                      userExcerpt: { id: userId, roles: result.newRoles },
                    })
                  },
                },
              },
            },
          }
        },
      }
    },
  }
}
