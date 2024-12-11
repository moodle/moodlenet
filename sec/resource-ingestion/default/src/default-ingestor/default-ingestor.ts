import { getReadableLocalAsset } from '@moodle/lib-storage-local-fs'
import { ingestionOutcome } from '@moodle/module/resource-ingestion'
import { asset } from '@moodle/module/storage'
import externalAssetIngestor from './puppeteer-ogs-url-ingestor'

export async function tikaIngestAsset({ tikaUrl, asset }: { tikaUrl: string; asset: asset }): Promise<ingestionOutcome> {
  if (asset.type === 'external') {
    return externalAssetIngestor({ asset, tikaUrl })
  }

  return {
    outcome: 'succeed',
    result: [
      {
        title: asset.name,
        content: await tikaIngest({
          tikaUrl,
          body: await getReadableLocalAsset(asset),
          mimeType: asset.mimetype,
        }),
        image: null,
        ingestionKind: `${asset.mimetype} file type`,
      },
    ],
  }
}
