import type { ResourceDoc } from '@moodlenet/core-domain/resource'
import { ingestTextFromFile } from './from-file'
import { ingestTextFromLink } from './from-link'
import type { resourceIngestionMetadata } from './types'

export async function ingestResourceData(doc: ResourceDoc): Promise<resourceIngestionMetadata | null> {
  if (doc.content.ref.kind === 'file') {
    return ingestTextFromFile(doc)
  } else {
    return ingestTextFromLink(doc)
  }
}
