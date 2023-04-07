import { FsItem } from '@moodlenet/simple-file-store/server'
import { EntityDocument } from '@moodlenet/system-entities/server'

export type ResourceEntityDoc = EntityDocument<ResourceDataType>
export type ResourceDataType = {
  title: string
  description: string
  content: null | { kind: 'file'; fsItem: FsItem } | { kind: 'link'; url: string }
  image: null | { kind: 'file'; directAccessId: string } // | { kind: 'url'; url: string }
}
