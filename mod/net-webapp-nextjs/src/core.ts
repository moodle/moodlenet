import { moodle_core_factory, moodle_core_impl } from '@moodle/domain'
import { assert_authorizeSystemSession } from '@moodle/mod-iam/lib'

export function net_webapp_nextjs_core(): moodle_core_factory {
  return ctx => {
    const moodle_core_impl: moodle_core_impl = {
      primary: {
        netWebappNextjs: {
          webapp: {
            async layouts() {
              const {
                configs: { layouts },
              } = await ctx.sys_call.secondary.netWebappNextjs.db.getConfigs()
              return layouts
            },
          },
          system: {
            async configs() {
              await assert_authorizeSystemSession(ctx)
              return ctx.sys_call.secondary.netWebappNextjs.db.getConfigs()
            },
          },
        },
      },
    }
    return moodle_core_impl
  }
}
