import { i_nat } from '@moodle/lib-types'
import { eduCollectionData } from '../../../edu/types/edu-content'
import { moodlenetPublicContentRecord } from './contributions'

export type moodlenetPublicEduCollectionId = string
export type moodlenetPublicEduCollectionRecord = moodlenetPublicContentRecord<
  eduCollectionData & {
    id: moodlenetPublicEduCollectionId
    stats: {
      points: i_nat
      followingCount: i_nat
    }
  }
>
