import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import { db_struct } from '../db-structure'

export function storage_secondary_factory({ db_struct }: { db_struct: db_struct }): secondaryProvider {
  return bootstrapCtx => {
    return secondaryCtx => {
      const secondaryAdapter: secondaryAdapter = {
        storage: {},
      }
      return secondaryAdapter
    }
  }
}
