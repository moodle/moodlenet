import { moodle_core_factory, moodle_core_impl } from '@moodle/domain'
import { _void } from '@moodle/lib-types'

export function net_core(): moodle_core_factory {
  return ctx => {
    const moodle_core_impl: moodle_core_impl = {
      primary: {
        net: {
          session: {
            async moduleInfo() {
              const {
                configs: { info, moodleNetPrimaryMsgSchemaConfigs },
              } = await ctx.sys_call.secondary.db.modConfigs.get({ mod: 'net' })
              return { info, schemaConfigs: moodleNetPrimaryMsgSchemaConfigs }
            },
          },

          admin: {
            async updatePartialMoodleNetInfo({ partialInfo }) {
              const [done] = await ctx.sys_call.secondary.db.modConfigs.updatePartial({
                mod: 'net',
                partialConfigs: { info: partialInfo },
              })
              return [done, _void]
            },
          },
        },
      },
    }
    return moodle_core_impl
  }
}
