import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import { dbStruct } from '../db-structure'

export function net_secondary_factory({ dbStruct }: { dbStruct: dbStruct }): secondaryProvider {
  return secondaryCtx => {
    const secondaryAdapter: secondaryAdapter = {
      net: {},
    }
    return secondaryAdapter
  }
}
