import { nat_int } from '@moodle/lib-types'
import { eduResourceData } from '../../../edu/types/edu-content'
import { moodlenetPublicContentRecord } from './contributions'

export type moodlenetPublicEduResourceId = string
export type moodlenetPublicEduResourceRecord = moodlenetPublicContentRecord<
  eduResourceData & {
    id: moodlenetPublicEduResourceId
    assetAccessCount: nat_int
    assetFulltext: string
    stats: {
      points: nat_int
      likesCount: nat_int
    }
  }
>
