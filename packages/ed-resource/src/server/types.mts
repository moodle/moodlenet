import type { FsItem } from '@moodlenet/simple-file-store/server'
import type { EntityDocument, SystemUser } from '@moodlenet/system-entities/server'

export type ResourceEntityDoc = EntityDocument<ResourceDataType>
export type ResourceDataType = {
  title: string
  description: string
  content: null | { kind: 'file'; fsItem: FsItem } | { kind: 'link'; url: string }
  image: null | Image
  published: boolean
  license: string
  subject: string
  language: string
  level: string
  month: string
  year: string
  type: string
  popularity?: {
    overall: number
    items: {
      downloads?: ResourcePopularityItem
    } & { [key: string]: ResourcePopularityItem }
  }
}
export type ResourcePopularityItem = { value: number }
export type Credits = {
  owner: { url: string; name: string }
  provider?: { name: string; url: string }
}

export type Image = ImageUploaded | ImageUrl
export type ImageUploaded = { kind: 'file'; directAccessId: string }
export type ImageUrl = { kind: 'url'; url: string; credits?: Credits | null }

export type ResourceEvents = {
  'resource:downloaded': {
    resourceKey: string
    currentSysUser: SystemUser
  }
}
