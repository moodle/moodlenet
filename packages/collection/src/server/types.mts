import type { EntityDocument } from '@moodlenet/system-entities/server'

export type CollectionEntityDoc = EntityDocument<CollectionDataType>
export type CollectionDataType = {
  title: string
  description: string
  image: null | { kind: 'file'; directAccessId: string } // | { kind: 'url'; url: string }
  published: boolean
  resourceList: string[]
}
