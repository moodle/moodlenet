import { ingestionOutcome } from '@moodle/module/resource-ingestion'
import { tikaIngestAsset } from 'lib-file-ingestion-tika'
import extensionSpecificIngestors from './fileExtensionSpecificIngestors'
import typeSpecificIngestor from './fileTypeSpecificIngestors'
import { assetIngestor } from './types'

export const ingestStoredAsset: assetIngestor<'stored'> = async ({ asset, env }) => {
  const ext = (asset.name.split('.').pop() ?? '').toLowerCase()

  const typeKind = (asset.mimetype.split('/').shift() ?? '').toLowerCase()

  const ingestor =
    extensionSpecificIngestors[ext] ??
    typeSpecificIngestor[typeKind] ??
    (async (): Promise<ingestionOutcome> => [false, { reason: 'noIngestorAvailable' }])

  return ingestor({ asset, env })
    .catch<null>(() => null)
    .then(mOutcome => mOutcome ?? tikaIngestAsset({ asset, tikaUrl: env.tikaServerUrl }))
    .catch<ingestionOutcome>(error => [false, { reason: 'error', error }])
}
