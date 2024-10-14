import { secondaryAdapter, secondaryBootstrap } from '@moodle/domain'
import { db_struct } from '../db-structure'

export function org_secondary_factory({ db_struct }: { db_struct: db_struct }): secondaryBootstrap {
  return bootstrapCtx => {
    return secondaryCtx => {
      const secondaryAdapter: secondaryAdapter = {
        org: {},
      }
      return secondaryAdapter
    }
  }
}
