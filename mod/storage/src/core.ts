import { moodle_core_factory, moodle_core_impl } from '@moodle/domain'

export function storage_core(): moodle_core_factory {
  return ctx => {
    const moodle_core_impl: moodle_core_impl = {
      primary: {
        storage: {
          session: {
            async moduleInfo() {
              const {
                configs: { uploadMaxSize },
              } = await ctx.sys_call.secondary.db.modConfigs.get({ mod: 'storage' })
              return { uploadMaxSizeConfigs: uploadMaxSize }
            },
          },
        },
      },
    }
    return moodle_core_impl
  }
}
