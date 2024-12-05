import type { RpcFile } from '@moodlenet/core'
import type { resourceExtractionMetadata } from '../types'

export interface FileExtractor {
  (FileExtractorArgs: {
    //readable: Readable
    //fileBuffer: Buffer
    rpcFile: RpcFile
  }): Promise<resourceExtractionMetadata | null>
}
