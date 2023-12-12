import type { RpcFile } from '@moodlenet/core'
import type { Readable } from 'stream'
import type { ResourceExtraction } from '../types.mjs'

export interface FileExtractor {
  (FileExtractorArgs: {
    readable: Readable
    compactedFileBuffer: Buffer
    rpcFile: RpcFile
  }): Promise<ResourceExtraction | null>
}
