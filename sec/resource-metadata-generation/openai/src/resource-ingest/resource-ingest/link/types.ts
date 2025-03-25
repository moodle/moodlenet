import type { resourceIngestionMetadata } from '../types'

export interface LinkIngestor {
  (LinkIngestorArgs: { linkUrl: string }): Promise<resourceIngestionMetadata | null>
}
