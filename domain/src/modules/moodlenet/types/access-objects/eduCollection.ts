import { eduCollectionData } from '../../../edu/types/edu-content'
import { moodlenetPublicContentRecord } from './contributions'

export type moodlenetPublicEduCollectionId = string
export type moodlenetPublicEduCollectionRecord = moodlenetPublicContentRecord<
  eduCollectionData & {
    id: moodlenetPublicEduCollectionId
  }
>
