import { URL } from 'url'
import { defaultIngestor } from './default-ingestor'
import { ingestor } from './types'

export const ingestExternalAsset: ingestor<'url'> = async ({ object, env }) => {
  const domain = new URL(object.url).hostname
  const domainIngestor: Record<string, ingestor<'url'>> = {}

  const ingestor = domainIngestor[domain] ?? defaultIngestor
  return ingestor({ env, object })
}
