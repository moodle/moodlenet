import type { EntityIdentifier } from '@moodlenet/system-entities/common'
import type { EntityDocument } from '@moodlenet/system-entities/server'

export type CollectionEntityDoc = EntityDocument<CollectionDataType>
export type CollectionMeta = {
  title: string
  description: string
  image: null | Image
}
export type CollectionDataType = CollectionMeta & {
  published: boolean
  resourceList: { _key: string }[]
  popularity?: {
    overall: number
    items: { [key: string]: CollectionPopularityItem }
  }
}
export type CollectionPopularityItem = { value: number }

export type Credits = {
  owner: { url: string; name: string }
  provider?: { name: string; url: string }
}
export type Image = ImageUploaded | ImageUrl
export type ImageUploaded = { kind: 'file'; directAccessId: string; credits?: Credits | null }
export type ImageUrl = { kind: 'url'; url: string; credits?: Credits | null }

export type CollectionEvents = CollectionActivityEvents
export type CollectionActivityEvents = {
  'resource-list-curation': {
    collectionKey: string
    action: 'add' | 'remove'
    resourceKey: string
    userId: EntityIdentifier
  }
  'created': {
    collectionKey: string
    meta: CollectionMeta
    userId: EntityIdentifier
  }
  'updated': {
    collectionKey: string
    newMeta: CollectionMeta
    userId: EntityIdentifier
  }
  'published': {
    collectionKey: string
    userId: EntityIdentifier
  }
  'unpublished': {
    collectionKey: string
    userId: EntityIdentifier
  }
  'deleted': {
    collectionKey: string
    userId: EntityIdentifier
  }
}
