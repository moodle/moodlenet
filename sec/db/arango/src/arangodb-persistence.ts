import { moodle_secondary_factory } from '@moodle/domain'
import { composeDomains } from '@moodle/lib-ddd'
import { ArangoDbSecEnv, getDbStruct } from './db-structure'
import {
  iam_moodle_secondary_factory,
  net_moodle_secondary_factory,
  net_webapp_nextjs_moodle_secondary_factory,
} from './sec'
import { org_moodle_secondary_factory } from './sec/db-arango-org'
import { user_home_moodle_secondary_factory } from './sec/db-arango-user-home'
import { db_moodle_secondary_factory } from './sec/db-arango-db'
export type { ArangoDbSecEnv } from './db-structure'

export function get_arango_persistence_factory({
  database_connections: database_connections,
}: ArangoDbSecEnv): moodle_secondary_factory {
  const db_struct = getDbStruct(database_connections)
  return ctx => {
    const secondary_adapter = composeDomains([
      net_moodle_secondary_factory({ db_struct })(ctx),
      org_moodle_secondary_factory({ db_struct })(ctx),
      iam_moodle_secondary_factory({ db_struct })(ctx),
      net_webapp_nextjs_moodle_secondary_factory({ db_struct })(ctx),
      user_home_moodle_secondary_factory({ db_struct })(ctx),
      db_moodle_secondary_factory({ db_struct })(ctx),
    ])
    return secondary_adapter
  }
}
