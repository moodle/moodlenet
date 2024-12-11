import { Configs } from '../types'

export const resource_ingestion_default_configs: Configs = {
  draft: {
    parallelism: 10,
    attempts: 3,
  },
}
