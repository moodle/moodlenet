import { secondaryBootstrap } from '@moodle/domain'
import { mergeSecondaryAdapters } from '@moodle/domain/lib'
import { ArangoDbSecEnv, getDbStruct } from './db-structure'
import { iam_secondary_factory, net_secondary_factory, net_webapp_nextjs_secondary_factory } from './sec'
import { org_secondary_factory } from './sec/db-arango-org'
import { user_home_secondary_factory } from './sec/db-arango-user-home'
import { env_secondary_factory } from './sec/env-arango-db'
export type { ArangoDbSecEnv } from './db-structure'

export function get_arango_persistence_factory({ database_connections }: ArangoDbSecEnv): secondaryBootstrap {
  const db_struct = getDbStruct(database_connections)
  return bootstrapCtx => {
    return secondaryCtx => {
      const secondaryAdapter = mergeSecondaryAdapters([
        net_secondary_factory({ db_struct })(bootstrapCtx)(secondaryCtx),
        org_secondary_factory({ db_struct })(bootstrapCtx)(secondaryCtx),
        iam_secondary_factory({ db_struct })(bootstrapCtx)(secondaryCtx),
        net_webapp_nextjs_secondary_factory({ db_struct })(bootstrapCtx)(secondaryCtx),
        user_home_secondary_factory({ db_struct })(bootstrapCtx)(secondaryCtx),
        env_secondary_factory({ db_struct })(bootstrapCtx)(secondaryCtx),
      ])
      return secondaryAdapter
    }
  }
}
