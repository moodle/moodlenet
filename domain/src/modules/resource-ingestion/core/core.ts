import { moduleCore } from '../../../types'

export const resource_ingestion_core: moduleCore<'resourceIngestion'> = {
  moduleName: 'resourceIngestion',
  /* primary(ctx) {
    return {
      async session() {
        return {
          async moduleInfo() {
            const { configs } = await ctx.mod.secondary.env.query.modConfigs({ mod: 'resourceIngestion' })
            return { configs }
          },
        }
      },
    }
  }, */
  primary: () => ({}),
  service: () => null,
  // async startBackgroundProcess(ctx) {},
  watch: ctx => ({
    secondary: {
      userProfile: {
        write: {
          async useTempFileAsNewResourceDraftAsset([outcome, { eduResourceDraftId, userProfileId }]) {
            if (outcome.status !== 'done') {
              return
            }

            await ctx.enqueue(ctx.write.ingestResource, {
              asset: outcome.asset,
              ingestionContext: {
                type: 'eduResourceDraft',
                userProfileId,
                eduResourceDraftId,
              },
            })
          },
        },
      },
    },
  }),
}
