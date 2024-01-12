import type { PersistentContext, ResourceDoc, ResourceMeta } from '@moodlenet/core-domain/resource'
import type { LearningOutcome } from '@moodlenet/ed-meta/common'
import type { FsItem } from '@moodlenet/simple-file-store/server'
import type { EntityIdentifier } from '@moodlenet/system-entities/common'
import type { EntityDocument } from '@moodlenet/system-entities/server'

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
  popularity?: {
    overall: number
    items: {
      downloads?: ResourcePopularityItem
    } & { [key: string]: ResourcePopularityItem }
  }
  persistentContext: Omit<PersistentContext, 'doc'>
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
    resourceKey: string
    userId: EntityIdentifier
  }
  'updated': {
    resourceKey: string
    updatedMeta: EventResourceMeta
    userId: EntityIdentifier
  }
  'published': {
    resourceKey: string
    userId: EntityIdentifier
  }
  'request-metadata-generation': {
    resourceKey: string
    userId: EntityIdentifier
  }
  'unpublished': {
    resourceKey: string
    userId: EntityIdentifier
  }
  'deleted': {
    resourceKey: string
    userId: EntityIdentifier
  }
}

export type EventResourceMeta = ResourceMeta & Pick<ResourceDoc, 'content' | 'image'>
