import { d_u, d_u__d, date_time_string } from '@moodle/lib-types'
import { asset, maybeAsset } from '../../storage'
import { eduResourceDraftId, userProfileId } from '../../user-profile'

export type Configs = {
  draft: {
    parallelism: number
    attempts: number
  }
}

export type eduResourceIngestionFailed = { reason: unknown }

export type eduResourceIngestionSucceed = {
  title: null | string
  content: null | string
  image: null | maybeAsset
  ingestionKind: string
}

// export type resourceIngestionMetadata = {
//   ingestor: string
//   ingestionMethod: string
//   title: string | null
//   rawText: string
//   inferredLanguageCode: null | contentLanguageCode
//   keywords: string[] | null
//   paragraphs: {
//     heading: string | null
//     body: string
//   }[]
// }
export type eduResourceIngestionStatus = d_u<
  {
    enqueued: eduResourceIngestionEnqueued
    ongoing: eduResourceIngestionStarted
    ingested: eduResourceIngestionEnded & eduResourceIngestionSucceed
    error: eduResourceIngestionEnded & eduResourceIngestionFailed
  },
  'status'
>

type eduResourceIngestionEnqueued = {
  failedAttempts: (eduResourceIngestionFailed & { date: date_time_string })[]
  enqueueDate: date_time_string
}
type eduResourceIngestionStarted = eduResourceIngestionEnqueued & {
  startDate: date_time_string
}
type eduResourceIngestionEnded = eduResourceIngestionStarted & {
  endDate: date_time_string
}

export type ingestionOutcome = d_u<
  {
    failed: eduResourceIngestionFailed
    succeed: eduResourceIngestionSucceed
  },
  'outcome'
>

export type eduResourceIngestionRecord = {
  id: `${userProfileId}#${eduResourceDraftId}`
  userProfileId: userProfileId
  eduResourceDraftId: eduResourceDraftId
  current: eduResourceIngestionStatus
  asset: asset
}

export type engagingResourceDraftIngestionRecord = eduResourceIngestionRecord & {
  status: d_u__d<eduResourceIngestionStatus, 'status', 'ongoing'>
}
