import { _void } from '@moodle/lib-types'
import { moduleCore } from '../../../types'
import { assert_authorizeCurrentUserSessionWithRole } from '../../user-account/lib'

export const moodlenet_core: moduleCore<'moodlenet'> = {
  modName: 'moodlenet',
  primary(ctx) {
    return {
      session: {
        async moduleInfo() {
          const {
            configs: {
              info,
              pointSystem,
              publishedCategories,
              moodlenetPrimaryMsgSchemaConfigs: moodlenetPrimaryMsgSchemaConfigs,
            },
          } = await ctx.mod.env.query.modConfigs({ mod: 'moodlenet' })
          return {
            info,
            schemaConfigs: moodlenetPrimaryMsgSchemaConfigs,
            pointSystem,
            publishedCategories,
          }
        },
      },
      contributor: {
        async getLeaders({ amount }) {
          const { contributors } = await ctx.mod.moodlenet.query.contributors({
            limit: amount,
            sort: ['points', 'DESC'],
          })
          return { leaderContributors: contributors }
        },
      },
      admin: {
        async updatePartialMoodlenetInfo({ partialInfo }) {
          assert_authorizeCurrentUserSessionWithRole({ ctx, role: 'admin' })
          const [done] = await ctx.mod.env.service.updatePartialConfigs({
            mod: 'moodlenet',
            partialConfigs: { info: partialInfo },
          })
          return [done, _void]
        },
      },
    }
  },
}
