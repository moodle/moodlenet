import { d_u__d, url_string } from '@moodle/lib-types'
import { ingestionOutcome } from '@moodle/module/resource-ingestion'
import { asset } from '@moodle/module/storage'

export type defaultResourceIngestorEnv = {
  tikaServerUrl: url_string
}

export type assetIngestor<type extends asset['type'] = asset['type']> = (fileIngestorArgs: {
  asset: d_u__d<asset, 'type', type>
  env: defaultResourceIngestorEnv
}) => Promise<ingestionOutcome>
