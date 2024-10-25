import type { ResourceExtraction } from '../types.mjs'

export interface LinkExtractor {
  (LinkExtractorArgs: { linkUrl: string }): Promise<ResourceExtraction | null>
}
