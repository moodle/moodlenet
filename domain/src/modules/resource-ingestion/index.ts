import { d_u } from '@moodle/lib-types'
import { asset } from '../storage'
import { eduResourceDraftId, userProfileIdSelect } from '../user-profile'
import { eduResourceIngestionOutcome } from './types'

export * from './types'

export default interface ResourceIngestionDomain {
  event: { resourceIngestion: unknown }
  primary: { resourceIngestion: unknown }
  service: { resourceIngestion: unknown }
  // primary: {
  //   resourceIngestion: {
  //     session: {
  //       moduleInfo(): Promise<{ configs: Configs }>
  //     }
  //   }
  // }
  secondary: {
    resourceIngestion: {
      write: {
        ingestResource(_: {
          asset: asset
          ingestionContext: d_u<
            {
              eduResourceDraft: {
                eduResourceDraftId: eduResourceDraftId
                userProfileIdSelect: userProfileIdSelect
              }
            },
            'type'
          >
        }): Promise<{ eduResourceIngestionOutcome: eduResourceIngestionOutcome }>
      }
      sync: unknown
      query: unknown
      service: unknown
    }
  }
}
