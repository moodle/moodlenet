import { d_u, d_u__d, mimetype, url_string } from '@moodle/lib-types'
// import { eduResourceIngestionOutcome } from '@moodle/module/resource-ingestion'
import { Readable } from 'stream'
export type defaultResourceIngestorEnv = {
  tikaServerUrl: url_string
}

export type ingestionObject = d_u<
  {
    url: { url: url_string }
    readable: { readable: Readable; name: string; mimetype: mimetype }
  },
  'type'
>

export type ingestor<type extends ingestionObject['type'] = ingestionObject['type']> = (fileIngestorArgs: {
  object: d_u__d<ingestionObject, 'type', type>
  env: defaultResourceIngestorEnv
}) => Promise<eduResourceIngestionOutcome>

type eduResourceIngestionOutcome = unknown
