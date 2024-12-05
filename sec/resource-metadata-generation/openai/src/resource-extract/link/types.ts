import type { resourceExtractionMetadata } from '../types'

export interface LinkExtractor {
  (LinkExtractorArgs: { linkUrl: string }): Promise<resourceExtractionMetadata | null>
}
