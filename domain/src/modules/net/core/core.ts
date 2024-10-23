import { _void } from '@moodle/lib-types'
import { moduleCore } from '../../../types'

export const net_core: moduleCore<'net'> = {
  modName: 'net',
  primary(ctx) {
    return {
      session: {
        async moduleInfo() {
          const {
            configs: { info, moodleNetPrimaryMsgSchemaConfigs },
          } = await ctx.mod.env.query.modConfigs({ mod: 'net' })
          return { info, schemaConfigs: moodleNetPrimaryMsgSchemaConfigs }
        },
      },

      admin: {
        async updatePartialMoodleNetInfo({ partialInfo }) {
          const [done] = await ctx.mod.env.service.updatePartialConfigs({
            mod: 'net',
            partialConfigs: { info: partialInfo },
          })
          return [done, _void]
        },
      },
    }
  },
}
