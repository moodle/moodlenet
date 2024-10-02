import { moodle_core_factory, moodle_core_impl } from '@moodle/domain'
import { generateNanoId } from '@moodle/lib-id-gen'
import { _unchecked_brand, _void } from '@moodle/lib-types'
import {
  assert_authorizeAdminUserSession,
  assert_authorizeUserAuthenticatedSession,
} from '@moodle/mod-iam/lib'
import { user_home_record } from 'domain/src/user-hone'

export function user_home_core(): moodle_core_factory {
  return ctx => {
    const moodle_core_impl: moodle_core_impl = {
      primary: {
        userHome: {
          myHome: {
            async editMyProfileInfo({ profileInfo }) {
              const { user } = await assert_authorizeUserAuthenticatedSession(ctx)
              const [done] = await ctx.sys_call.secondary.userHome.db.updatePartialProfileInfo({
                userId: user.id,
                partialProfileInfo: profileInfo,
              })
              return [done, _void]
            },
            configs() {
              return ctx.sys_call.secondary.userHome.db.getConfigs()
            },
          },
          admin: {
            async updatePartialUserHomeConfigs({ partialConfigs }) {
              await assert_authorizeAdminUserSession(ctx)
              const [done] = await ctx.sys_call.secondary.userHome.db.updatePartialConfigs({
                partialConfigs,
              })
              return [done, _void]
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
                  userId: user.id,
                  profileInfo: {
                    displayName: user.displayName,
                    aboutMe: '',
                    location: '',
                    siteUrl: '',
                  },
                }),
              })
            },
          },
        },
      },
    }
    return moodle_core_impl
  }
}
