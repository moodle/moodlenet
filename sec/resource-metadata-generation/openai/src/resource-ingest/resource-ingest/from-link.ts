import type { ResourceDoc } from '@moodlenet/core-domain/resource'
import assert from 'assert'
import { URL } from 'url'
import defaultLinkIngestor from './link/defaultIngestor'
import type { LinkIngestor } from './link/types'
import type { resourceIngestionMetadata } from './types'

export async function ingestTextFromLink(doc: ResourceDoc): Promise<resourceIngestionMetadata | null> {
  assert(doc.content.ref.kind === 'link')
  const linkUrl = doc.content.ref.url
  const domain = new URL(linkUrl).hostname
  const domainIngestor: Record<string, LinkIngestor> = {}

  const ingestor = domainIngestor[domain] ?? defaultLinkIngestor
  return ingestor({ linkUrl })
}
