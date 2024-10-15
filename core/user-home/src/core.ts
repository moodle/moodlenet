import { assert_authorizeAuthenticatedUserSession } from '@moodle/core-iam/lib'
import { assertWithErrorXxx, coreBootstrap, userHome } from '@moodle/domain'
import { generateNanoId } from '@moodle/lib-id-gen'
import { _unchecked_brand, _void } from '@moodle/lib-types'
import { accessUserHome } from './lib'

export const user_home_core: coreBootstrap<'userHome'> = ({ log }) => {
  return {
    modName: 'userHome',
    provider(coreCtx) {
      return {
        primary(priCtx) {
          return {
            write: {
              async editProfileInfo({ user_home_id, profileInfo }) {
                const userHome = await accessUserHome({
                  coreCtx,
                  priCtx,
                  by: { idOf: 'user_home', user_home_id },
                })
                if (userHome.result === 'notFound') {
                  return [false, { reason: 'notFound' }]
                }
                assertWithErrorXxx(
                  userHome.access === 'allowed' && userHome.permissions.editProfile,
                  'Unauthorized',
                )
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
            query: {
              async configs() {
                const { configs } = await coreCtx.mod.env.query.modConfigs({
                  mod: 'userHome',
                })
                return { configs }
              },
              async userHome({ by }) {
                const userHomeResult = await accessUserHome({ priCtx, coreCtx, by })

                if (
                  userHomeResult.result === 'notFound' ||
                  userHomeResult.access === 'notAllowed'
                ) {
                  return [false, { reason: 'notFound' }]
                }
                return [true, { accessObject: userHomeResult }]
              },
            },
            uploads: {
              async useImageInProfile({ as, tempId }) {
                const { user } = await assert_authorizeAuthenticatedUserSession({ coreCtx, priCtx })
                const userHome = await accessUserHome({
                  coreCtx,
                  priCtx,
                  by: { idOf: 'user', user_id: user.id },
                })
                assertWithErrorXxx(
                  userHome.result === 'found' &&
                    userHome.access === 'allowed' &&
                    userHome.permissions.editProfile,
                  'Unauthorized',
                )
                const [done, result] = await coreCtx.write.useImageInProfile({
                  as,
                  id: userHome.id,
                  tempId,
                })
                if (!done) {
                  return [false, result]
                }
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
                  //REVIEW - this iam should emit an event and catch it here  in userhome
                  async saveNewUser([[created, resp], { newUser }]) {
                    log('debug', 'user-home watch saveNewUser', { created, resp, newUser })
                    if (!created) {
                      return
                    }
                    const user_home_id = await generateNanoId()
                    return coreCtx.write.createUserHome({
                      userHome: _unchecked_brand<userHome.user_home_record>({
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
