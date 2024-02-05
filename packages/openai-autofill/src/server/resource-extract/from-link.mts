import type { ResourceDoc } from '@moodlenet/core-domain/resource'
import assert from 'assert'
import { URL } from 'url'
import defaultLinkExtractor from './link/defaultExtractor.mjs'
import type { LinkExtractor } from './link/types.mjs'
import type { ResourceExtraction } from './types.mjs'

export async function extractTextFromLink(doc: ResourceDoc): Promise<ResourceExtraction | null> {
  assert(doc.content.ref.kind === 'link')
  const linkUrl = doc.content.ref.url
  const domain = new URL(linkUrl).hostname
  const domainExtractor: Record<string, LinkExtractor> = {}

  const extractor = domainExtractor[domain] ?? defaultLinkExtractor
  return extractor({ linkUrl })
}
