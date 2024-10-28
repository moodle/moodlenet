import { _void } from '@moodle/lib-types'
import { moduleCore } from '../../../types'
import { assert_authorizeCurrentUserSessionWithRole } from '../../user-account/lib'

export const moodlenet_core: moduleCore<'moodlenet'> = {
  modName: 'moodlenet',
  service() {
    return
  },
  primary(ctx) {
    return {
      session: {
        async moduleInfo() {
          const {
            configs: { info, pointSystem, moodlenetPrimaryMsgSchemaConfigs: moodlenetPrimaryMsgSchemaConfigs },
          } = await ctx.mod.secondary.env.query.modConfigs({ mod: 'moodlenet' })
          return {
            info,
            schemaConfigs: moodlenetPrimaryMsgSchemaConfigs,
            pointSystem,
          }
        },
      },
      content: {
        async getSuggestedContent() {
          const [foundMyProfile, result] = await ctx.forward.userProfile.me.getMyProfile()
          if (!foundMyProfile) {
            return { suggestions: [] }
          }
          return { suggestions: result.userProfileRecord.appData.moodlenet.suggestedContent.list }
        },
      },
      contributor: {
        async getLeaders({ amount }) {
          const { moodlenetContributorRecord } = await ctx.mod.secondary.moodlenet.query.contributors({
            limit: amount,
            sort: ['points', 'DESC'],
          })
          return { leaderContributors: contributors }
        },
      },
      admin: {
        async updatePartialMoodlenetInfo({ partialInfo }) {
          assert_authorizeCurrentUserSessionWithRole({ ctx, role: 'admin' })
          const [done] = await ctx.mod.secondary.env.service.updatePartialConfigs({
            mod: 'moodlenet',
            partialConfigs: { info: partialInfo },
          })
          return [done, _void]
        },
      },
    }
  },
}
