import type { PersistentContext, ResourceDoc, ResourceMeta } from '@moodlenet/core-domain/resource'
import type { LearningOutcome } from '@moodlenet/ed-meta/common'
import type { FsItem } from '@moodlenet/simple-file-store/server'
import type { EntityIdentifier } from '@moodlenet/system-entities/common'
import type { EntityDocument, EntityFullDocument } from '@moodlenet/system-entities/server'

export type ResourceEntityDoc = EntityDocument<ResourceDataType>
export type Content = FileContent | LinkContent
export interface FileContent {
  kind: 'file'
  fsItem: FsItem
}

export interface LinkContent {
  kind: 'link'
  url: string
}

export type ResourcePersistentContext = Pick<PersistentContext, 'generatedData' | 'state'>

export type ResourceDataType = {
  title: string
  description: string
  content: Content
  image: null | Image
  published: boolean
  license: string
  subject: string
  language: string
  level: string
  month: string
  year: string
  type: string
  learningOutcomes: LearningOutcome[]
  points?: null | number
  popularity?: null | {
    overall: number
    items: {
      downloads?: ResourcePopularityItem
    } & { [key: string]: ResourcePopularityItem }
  }
  persistentContext: ResourcePersistentContext
}
export type ResourcePopularityItem = { value: number }
export type Credits = {
  owner: { url: string; name: string }
  provider?: { name: string; url: string }
}

export type Image = ImageUploaded | ImageUrl
export type ImageUploaded = { kind: 'file'; directAccessId: string }
export type ImageUrl = { kind: 'url'; url: string; credits?: Credits | null }

export type ResourceEvents = ResourceActivityEvents // & {}
export type ResourceActivityEvents = {
  'downloaded': {
    resourceKey: string
    userId: EntityIdentifier | null
  }
  'created': {
    userId: EntityIdentifier
    resource: EntityFullDocument<ResourceDataType>
  }
  'updated-meta': {
    resourceKey: string
    userId: EntityIdentifier
    meta: EventResourceMeta
    oldMeta: EventResourceMeta
  }

  'published': {
    userId: EntityIdentifier
    resource: EntityFullDocument<ResourceDataType>
  }
  'request-metadata-generation': {
    resourceKey: string
    userId: EntityIdentifier
  }
  'unpublished': {
    userId: EntityIdentifier
    resource: EntityFullDocument<ResourceDataType>
  }
  'deleted': {
    userId: EntityIdentifier
    resource: EntityFullDocument<ResourceDataType>
  }
}

export type EventResourceMeta = ResourceMeta & Pick<ResourceDoc, 'image'>
