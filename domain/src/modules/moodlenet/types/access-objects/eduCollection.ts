import { non_negative_integer } from '@moodle/lib-types'
import { eduCollectionData } from '../../../edu/types/edu-content'
import { moodlenetPublicContentRecord } from './contributions'

export type moodlenetPublicEduCollectionId = string
export type moodlenetPublicEduCollectionRecord = moodlenetPublicContentRecord<
  eduCollectionData & {
    id: moodlenetPublicEduCollectionId
    stats: {
      points: non_negative_integer
      followingCount: non_negative_integer
    }
  }
>
