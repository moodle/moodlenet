import { RpcFile } from '@moodlenet/core'
import { EntityDocument } from '@moodlenet/system-entities/server'

export type ResourceEntityDoc = EntityDocument<ResourceDataType>
export type ResourceDataType = {
  title: string
  description: string
  content:
    | null
    | { kind: 'file'; rpcFile: RpcFile; uploadedAt: string }
    | { kind: 'link'; url: string }
  image: null | { kind: 'file'; directAccessId: string } // | { kind: 'url'; url: string }
}
