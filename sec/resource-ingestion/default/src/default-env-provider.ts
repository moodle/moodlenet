import { map, url_string_schema } from '@moodle/lib-types'
import { object } from 'zod'

import { defaultResourceIngestorEnv } from './types'

export type env_keys = 'MOODLE_TIKA_RESOURCE_INGESTOR_SERVER_URL'
export function provideDefaultResourceIngestorSecEnv({ env }: { env: map<unknown, env_keys> }): defaultResourceIngestorEnv {
  const env_config = object({
    MOODLE_TIKA_RESOURCE_INGESTOR_SERVER_URL: url_string_schema,
  }).parse({
    MOODLE_TIKA_RESOURCE_INGESTOR_SERVER_URL: env.MOODLE_TIKA_RESOURCE_INGESTOR_SERVER_URL,
  })

  const defaultResourceIngestorEnv: defaultResourceIngestorEnv = {
    tikaServerUrl: env_config.MOODLE_TIKA_RESOURCE_INGESTOR_SERVER_URL,
  }
  return defaultResourceIngestorEnv
}
