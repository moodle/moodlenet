import type { ResourceDoc } from '@moodlenet/core-domain/resource'
import { extractTextFromFile } from './from-file'
import { extractTextFromLink } from './from-link'
import type { resourceExtractionMetadata } from './types'

export async function extractResourceData(doc: ResourceDoc): Promise<resourceExtractionMetadata | null> {
  if (doc.content.ref.kind === 'file') {
    return extractTextFromFile(doc)
  } else {
    return extractTextFromLink(doc)
  }
}
