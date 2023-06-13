import type { EntityDocument } from '@moodlenet/system-entities/server'

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
export type ImageUploaded = { kind: 'file'; directAccessId: string }
export type ImageUrl = { kind: 'url'; url: string; credits?: Credits | null }
