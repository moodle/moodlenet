import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import { dbStruct } from '../db-structure'

export function org_secondary_factory({ dbStruct }: { dbStruct: dbStruct }): secondaryProvider {
  return secondaryCtx => {
    const secondaryAdapter: secondaryAdapter = {
      org: {},
    }
    return secondaryAdapter
  }
}
