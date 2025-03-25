import { NO_JOB_HERE } from '@moodle/domain/lib'
import { defaultResourceIngestorEnv } from './types'

export function get_default_resource_ingestion_secondary_factory({ tikaServerUrl: _ }: defaultResourceIngestorEnv): moo.def.model.impl {
  const modelImpl: moo.def.model.impl = {
    userHome: NO_JOB_HERE,
  }
  return modelImpl
}
