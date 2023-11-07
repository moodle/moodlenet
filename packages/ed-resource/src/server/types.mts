import type { resource } from '@moodlenet/core-domain'
import type { LearningOutcome } from '@moodlenet/ed-meta/common'
import type { FsItem } from '@moodlenet/simple-file-store/server'
import type { EntityDocument, SystemUser } from '@moodlenet/system-entities/server'

export type ResourceEntityDoc = EntityDocument<ResourceDataType>
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
  content: FileContent | LinkContent
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
  lifecycleState: resource.lifecycle.StateName
}
export type ResourcePopularityItem = { value: number }
export type Credits = {
  owner: { url: string; name: string }
  provider?: { name: string; url: string }
}

export type Image = ImageUploaded | ImageUrl
export type ImageUploaded = { kind: 'file'; directAccessId: string; credits?: Credits }
export type ImageUrl = { kind: 'url'; url: string; credits?: Credits | null }

export type ResourceEvents = {
  'resource:downloaded': {
    resourceKey: string
    currentSysUser: SystemUser
  }
}
