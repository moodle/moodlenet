import type { RpcFile } from '@moodlenet/core'
import type { resourceIngestionMetadata } from '../types'

export interface FileIngestor {
  (FileIngestorArgs: {
    //readable: Readable
    //fileBuffer: Buffer
    rpcFile: RpcFile
  }): Promise<resourceIngestionMetadata | null>
}
