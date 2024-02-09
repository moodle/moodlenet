import type { RpcFile } from '@moodlenet/core'

export interface ResourceExtraction {
  title: undefined | string
  content: undefined | string
  contentDesc: string
  type: string
  provideImage: undefined | RpcFile
}
