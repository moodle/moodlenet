import { composeImpl, sec_factory } from '@moodle/lib-ddd'
import { ArangoDbSecEnv, getDbStruct } from './db-structure'
import { iam, net, netWebappNextjs } from './sec/moodle'
import { org } from './sec/moodle/db-arango-org'
export type { ArangoDbSecEnv } from './db-structure'

export function get_arango_persistence_factory({
  database_connections: database_connections,
}: ArangoDbSecEnv): sec_factory {
  const db_struct = getDbStruct(database_connections)
  return async function factory(ctx) {
    return composeImpl(
      await net({ db_struct })(ctx),
      await org({ db_struct })(ctx),
      await iam({ db_struct })(ctx),
      await netWebappNextjs({ db_struct })(ctx),
    )
  }
}
