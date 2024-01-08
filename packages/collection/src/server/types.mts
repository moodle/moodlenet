import type { EntityDocument, Patch, SystemUser } from '@moodlenet/system-entities/server'

export type CollectionEntityDoc = EntityDocument<CollectionDataType>
export type CollectionDataType = {
  title: string
  description: string
  image: null | Image
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
    collectionDoc: CollectionEntityDoc
    action: 'add' | 'remove'
    resourceKey: string
    systemUser: SystemUser
  }
  'created': {
    collectionDoc: CollectionEntityDoc
    systemUser: SystemUser
  }
  'updated': {
    collectionDoc: CollectionEntityDoc
    collectionDocOld: CollectionEntityDoc
    input: {
      meta?: Patch<CollectionDataType>
      image: boolean
    }
    systemUser: SystemUser
  }
  'request-publishing': {
    collectionDoc: CollectionEntityDoc
    systemUser: SystemUser
  }
  'publishing-acceptance': {
    collectionDoc: CollectionEntityDoc
    accepted: true
    automaticAcceptance: true
  }

  'unpublished': {
    collectionDoc: CollectionEntityDoc
    systemUser: SystemUser
  }
  'deleted': {
    systemUser: SystemUser
    collectionDoc: CollectionEntityDoc
  }
}
