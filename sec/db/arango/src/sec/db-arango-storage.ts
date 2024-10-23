import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import { dbStruct } from '../db-structure'

export function storage_secondary_factory({ dbStruct }: { dbStruct: dbStruct }): secondaryProvider {
  return secondaryCtx => {
    const secondaryAdapter: secondaryAdapter = {
      storage: {},
    }
    return secondaryAdapter
  }
}
