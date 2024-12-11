import { unreachable_never } from '@moodle/lib-types'
import { ingestStoredAsset } from './ingest-stored-asset'
import { ingestExternalAsset } from './ingest-external-asset'
import { assetIngestor } from './types'

export const ingestResourceData: assetIngestor = async ({ asset, env }) => {
  if (asset.type === 'stored') {
    return ingestStoredAsset({ asset, env })
  } else if (asset.type === 'external') {
    return ingestExternalAsset({ asset, env })
  } else {
    return unreachable_never(asset)
  }
}
