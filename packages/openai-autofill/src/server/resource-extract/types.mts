import type { RpcFile } from '@moodlenet/core'

export interface ResourceExtraction {
  text: string
  contentDesc: string
  type: string
  provideImage: undefined | RpcFile
}
