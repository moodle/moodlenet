import { moodle_core_factory, moodle_core_impl } from '@moodle/domain'
import { assertWithErrorXxx } from '@moodle/lib-ddd'
import { generateNanoId } from '@moodle/lib-id-gen'
import { _unchecked_brand, _void } from '@moodle/lib-types'
import { user_home_record } from 'domain/src/user-hone'
import { accessUserHome } from './lib'
import { assert_authorizeSystemSession } from '@moodle/mod-iam/lib'

export function user_home_core(): moodle_core_factory {
  return ctx => {
    const moodle_core_impl: moodle_core_impl = {
      primary: {
        userHome: {
          write: {
            async editProfileInfo({ user_home_id, profileInfo }) {
              const userHome = await accessUserHome({
                ctx,
                by: { idOf: 'user_home', user_home_id },
              })
              if (userHome.result === 'notFound') {
                return [false, { reason: 'notFound' }]
              }
              assertWithErrorXxx(
                userHome.access === 'allowed' && userHome.permissions.editProfile,
                'Unauthorized',
              )
              const [done] = await ctx.sys_call.secondary.userHome.db.updatePartialProfileInfo({
                id: user_home_id,
                partialProfileInfo: profileInfo,
              })
              if (!done) {
                return [false, { reason: 'unknown' }]
              }
              return [done, _void]
            },
          },
          read: {
            async configs() {
              const { configs } = await ctx.sys_call.secondary.userHome.db.getConfigs()
              return { configs }
            },
            async userHome({ by }) {
              const userHomeResult = await accessUserHome({ ctx, by })

              if (userHomeResult.result === 'notFound' || userHomeResult.access === 'notAllowed') {
                return [false, { reason: 'notFound' }]
              }
              return [true, { accessObject: userHomeResult }]
            },
          },
        },
      },
      event: {
        iam: {
          userBase: {
            async newUserCreated({ user }) {
              const user_home_id = await generateNanoId()
              return ctx.sys_call.secondary.userHome.db.createUserHome({
                userHome: _unchecked_brand<user_home_record>({
                  id: user_home_id,
                  user: {
                    id: user.id,
                    roles: user.roles,
                  },
                  profileInfo: {
                    displayName: user.displayName,
                    aboutMe: '',
                    location: '',
                    siteUrl: null,
                  },
                }),
              })
            },
          },
          userRoles: {
            async userRolesUpdated({ userId, roles }) {
              await ctx.sys_call.secondary.userHome.db.align_userExcerpt({
                userExcerpt: { id: userId, roles },
              })
            },
          },
        },
      },
    }
    return moodle_core_impl
  }
}

