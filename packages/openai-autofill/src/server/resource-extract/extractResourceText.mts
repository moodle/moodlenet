import type { ResourceDoc } from '@moodlenet/core-domain/resource'
import { extractTextFromFile } from './from-file.mjs'
import { extractTextFromLink } from './from-link.mjs'
import type { ResourceExtraction } from './types.mjs'

export async function extractResourceData(doc: ResourceDoc): Promise<ResourceExtraction | null> {
  if (doc.content.ref.kind === 'file') {
    return extractTextFromFile(doc)
  } else {
    return extractTextFromLink(doc)
  }
}
