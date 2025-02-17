import { non_negative_integer } from '@moodle/lib-types'
import { eduResourceData } from '../../../edu/types/edu-content'
import { moodlenetPublicContentRecord } from './contributions'

export type moodlenetPublicEduResourceId = string
export type moodlenetPublicEduResourceRecord = moodlenetPublicContentRecord<
  eduResourceData & {
    id: moodlenetPublicEduResourceId
    assetAccessCount: non_negative_integer
    assetFulltext: string
    stats: {
      points: non_negative_integer
      likesCount: non_negative_integer
    }
  }
>
