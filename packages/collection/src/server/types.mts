import { EntityDocument } from '@moodlenet/system-entities/server'

export type CollectionEntityDoc = EntityDocument<CollectionDataType>
export type CollectionDataType = {
  title: string
  description: string
}
