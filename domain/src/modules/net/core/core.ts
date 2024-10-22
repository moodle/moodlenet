import { _void } from '@moodle/lib-types'
import { moduleCore } from '../../../types'
import { assert_authorizeCurrentUserSessionWithRole } from '../../iam/lib'

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
          assert_authorizeCurrentUserSessionWithRole({ ctx, role: 'admin' })
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
