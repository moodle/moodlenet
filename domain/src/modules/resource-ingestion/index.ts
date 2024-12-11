import { d_u } from '@moodle/lib-types'
import { asset } from '../storage'
import { eduResourceDraftId, userProfileId } from '../user-profile'
import { Configs, engagingResourceDraftIngestionRecord, ingestionOutcome } from './types'

export * from './types'

export default interface ResourceIngestionDomain {
  event: { resourceIngestion: unknown }
  service: { resourceIngestion: unknown }
  primary: {
    resourceIngestion: {
      session: {
        moduleInfo(): Promise<{ configs: Configs }>
      }
    }
  }
  secondary: {
    resourceIngestion: {
      service: {
        ingestResource(_: {
          asset: asset
          ingestionContext: d_u<
            {
              draft: {
                eduResourceDraftId: eduResourceDraftId
                userProfileId: userProfileId
              }
            },
            'type'
          >
        }): Promise<ingestionOutcome>
      }
      sync: unknown
      query: {
        engageEnqueuedDraftResourcesIngestion(_: {
          maxOngoingAmount: number
        }): Promise<engagingResourceDraftIngestionRecord[]>
      }
      write: unknown
    }
  }
}
