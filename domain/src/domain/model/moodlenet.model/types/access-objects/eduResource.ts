import { i_nat } from '@moodle/lib-types'
import { eduResourceData } from '../../../edu/types/edu-content'
import { moodlenetPublicContentRecord } from './contributions'

export type moodlenetPublicEduResourceId = string
export type moodlenetPublicEduResourceRecord = moodlenetPublicContentRecord<
  eduResourceData & {
    id: moodlenetPublicEduResourceId
    assetAccessCount: i_nat
    assetFulltext: string
    stats: {
      points: i_nat
      likesCount: i_nat
    }
  }
>
