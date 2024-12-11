import { secondaryProvider } from '@moodle/domain'
import { defaultResourceIngestorEnv } from './types'

export function get_default_resource_ingestion_secondary_factory(env: defaultResourceIngestorEnv): secondaryProvider {
  return secondaryContext => {
    return {
      resourceIngestion: {
        service: {
          ingestResource({ asset, ingestionContext }) {
            env.tikaServerUrl
          },
        },
      },
    }
  }
}
