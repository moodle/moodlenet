import { unreachable_never } from '@moodle/lib-types'
import { moduleCore } from '../../../types'

export const resource_ingestion_core: moduleCore<'resourceIngestion'> = {
  moduleName: 'resourceIngestion',
  primary(ctx) {
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
  },
  service() {
    return
  },
  async startBackgroundProcess(ctx) {
    engageDraftResourceIngestions()
    async function engageDraftResourceIngestions() {
      const {
        configs: { draft: ingestionParallelism },
      } = await ctx.mod.secondary.env.query.modConfigs({ mod: 'resourceIngestion' })

      const engagedDraftResourceIngestions =
        await ctx.mod.secondary.resourceIngestion.query.engageEnqueuedDraftResourcesIngestion({
          parallelilsm: ingestionParallelism.parallelism,
        })

      engagedDraftResourceIngestions.forEach(({ asset, attempt, eduResourceDraftId, userProfileId }) => {
        ctx.mod.secondary.resourceIngestion.service.ingestResource({
          asset,
          ingestionContext: {
            type: 'draft',
            eduResourceDraftId,
            userProfileId,
          },
        })
      })
    }
  },
  watch(ctx) {
    return {
      secondary: {
        resourceIngestion: {
          service: {
            async ingestResource([outcome, payload]) {
              if (payload.ingestionContext.type === 'draft') {
                ctx.mod.service.userProfile.draftResourceIngestionOutcome({
                  userProfileId: payload.ingestionContext.userProfileId,
                  eduResourceDraftId: payload.ingestionContext.eduResourceDraftId,
                  ingestionOutcome: outcome,
                  attemptsLeft: payload.attemptsLeft,
                })
              } else {
                unreachable_never(payload.ingestionContext.type)
              }
            },
          },
        },
      },
    }
  },
}
