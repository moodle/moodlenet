import { non_negative_integer } from '@moodle/lib-types'
import { resourceExtractionResult } from '../../../resource-extraction'
import { eduResourceData } from '../../../edu/types/edu-content'
import { moodlenetPublicContentRecord } from './contributions'

export type moodlenetPublicEduResourceId = string
export type moodlenetPublicEduResourceRecord = moodlenetPublicContentRecord<
  eduResourceData & {
    id: moodlenetPublicEduResourceId
    linkAccessCount: non_negative_integer
    resourceExtractionMetadata: resourceExtractionResult
  }
>
