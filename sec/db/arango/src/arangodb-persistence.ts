import { secondaryProvider } from '@moodle/domain'
import { mergeSecondaryAdapters } from '@moodle/domain/lib'
import { ArangoDbSecEnv, getDbStruct } from './db-structure'
import {
  user_profile_secondary_factory,
  iam_secondary_factory,
  net_secondary_factory,
  net_webapp_nextjs_secondary_factory,
  org_secondary_factory,
  storage_secondary_factory,
} from './sec'
import { env_secondary_factory } from './sec/env-arango-db'
export type { ArangoDbSecEnv } from './db-structure'

export function get_arango_persistence_factory({ database_connections }: ArangoDbSecEnv): secondaryProvider {
  const db_struct = getDbStruct(database_connections)
  return secondaryCtx => {
    const secondaryAdapter = mergeSecondaryAdapters([
      net_secondary_factory({ db_struct })(secondaryCtx),
      org_secondary_factory({ db_struct })(secondaryCtx),
      iam_secondary_factory({ db_struct })(secondaryCtx),
      net_webapp_nextjs_secondary_factory({ db_struct })(secondaryCtx),
      user_profile_secondary_factory({ db_struct })(secondaryCtx),
      env_secondary_factory({ db_struct })(secondaryCtx),
      storage_secondary_factory({ db_struct })(secondaryCtx),
    ])
    return secondaryAdapter
  }
}
