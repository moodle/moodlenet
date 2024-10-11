import { moodle_core_factory, moodle_core_impl } from '@moodle/domain'

export function net_webapp_nextjs_core(): moodle_core_factory {
  return ctx => {
    const moodle_core_impl: moodle_core_impl = {
      primary: {
        netWebappNextjs: {
          webapp: {
            async layouts() {
              const {
                configs: { layouts },
              } = await ctx.sys_call.secondary.db.modConfigs.get({ mod: 'netWebappNextjs' })
              return layouts
            },
          },
        },
      },
    }
    return moodle_core_impl
  }
}
