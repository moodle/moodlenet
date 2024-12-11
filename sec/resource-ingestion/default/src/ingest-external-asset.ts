import { tikaIngestAsset } from 'lib-file-ingestion-tika'
import { URL } from 'url'
import { assetIngestor } from './types'

export const ingestExternalAsset: assetIngestor<'external'> = async ({ asset, env }) => {
  const linkUrl = asset.url
  const domain = new URL(linkUrl).hostname
  const domainIngestor: Record<string, assetIngestor<'external'>> = {}

  const ingestor = domainIngestor[domain]
  return ingestor ? ingestor({ env, asset }) : tikaIngestAsset({ asset, tikaUrl: env.tikaServerUrl })
}
