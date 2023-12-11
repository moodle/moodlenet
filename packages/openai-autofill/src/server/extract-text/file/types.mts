import type { RpcFile } from '@moodlenet/core'
import type { Readable } from 'stream'
import type { ResourceTextAndDesc } from '../types.mjs'

export interface FileExtractor {
  ({
    compactedFileBuffer,
    rpcFile,
  }: {
    readable: Readable
    compactedFileBuffer: Buffer
    rpcFile: RpcFile
  }): Promise<ResourceTextAndDesc | null>
}
