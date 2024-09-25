import { composeImpl, sec_factory } from '@moodle/lib-ddd'
import { v1_0 } from './'
import { iam, net, netWebappNextjs } from './sec/moodle'
import { org } from './sec/moodle/db-arango-org'

export function get_arango_persistence_factory({
  database_connections: database_connections,
}: v1_0.ArangoDbSecEnv): sec_factory {
  const db_struct = v1_0.getDbStruct(database_connections)
  return async function factory(ctx) {
    return composeImpl(
      await net({ db_struct_v1_0: db_struct })(ctx),
      await org({ db_struct_v1_0: db_struct })(ctx),
      await iam({ db_struct_v1_0: db_struct })(ctx),
      await netWebappNextjs({ db_struct_v1_0: db_struct })(ctx),
    )
  }
}
