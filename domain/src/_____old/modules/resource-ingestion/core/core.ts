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
    result: {
      secondary: {
        userProfile: {
          write: {
            async createDraft([[created], { draft, userProfileIdSelect }]) {
              if (!created || draft.type !== 'eduResource') {
                return
              }

              await ctx.enqueue(ctx.write.ingestResource, {
                asset: draft.data.data.asset,
                ingestionContext: {
                  type: 'eduResourceDraft',
                  userProfileIdSelect,
                  eduResourceDraftId: draft.data.draftId,
                },
              })
            },
            // async useTempFileAsNewResourceDraftAsset([outcome, { eduResourceDraftId, userProfileId }]) {
            //   if (outcome.status !== 'done') {
            //     return
            //   }

            //   await ctx.enqueue(ctx.write.ingestResource, {
            //     asset: outcome.asset,
            //     ingestionContext: {
            //       type: 'eduResourceDraft',
            //       userProfileIdSelect: { by: 'userProfileId', userProfileId },
            //       eduResourceDraftId,
            //     },
            //   })
            // },
          },
        },
      },
    },
  }),
}
