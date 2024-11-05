import type { RpcFile } from '@moodlenet/core'
import type { ResourceExtraction } from '../types.mjs'

export interface FileExtractor {
  (FileExtractorArgs: {
    //readable: Readable
    //fileBuffer: Buffer
    rpcFile: RpcFile
  }): Promise<ResourceExtraction | null>
}
