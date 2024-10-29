import { date_time_string, non_negative_integer } from '@moodle/lib-types'
import { textExtractionResult } from '../../asset-text-extraction'
import { eduResourceCollectionData, eduResourceData } from '../../edu/types/edu-content'
import { moodlenetContributorId } from './moodlenet-contributor'

export type moodlenetPublicEduResourceId = string
export type moodlenetPublicEduResourceRecord = moodlenetPublicContentRecord<
  eduResourceData & {
    id: moodlenetPublicEduResourceId
    linkAccessCount: non_negative_integer
    assetTextExtraction: textExtractionResult
  }
>

export type moodlenetPublicEduResourceCollectionId = string
export type moodlenetPublicEduResourceCollectionRecord = moodlenetPublicContentRecord<
  eduResourceCollectionData & {
    id: moodlenetPublicEduResourceCollectionId
  }
>

type moodlenetPublicContributionMeta = {
  moodlenetContributorId: moodlenetContributorId
  firstMoodlenetPublicationDate: date_time_string
  lastMoodlenetPublicationDate: date_time_string
  stats: {
    // viewCount: non_negative_integer
    recalculatedDate: date_time_string
    popularity: non_negative_integer
  }
}

type moodlenetPublicContentRecord<recordType> = recordType & {
  meta: moodlenetPublicContributionMeta
}
