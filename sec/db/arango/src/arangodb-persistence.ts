import { NO_JOB_HERE } from '@moodle/domain/lib'
import { ArangoDbSecEnv, getDbStruct } from './db-structure'
export type { ArangoDbSecEnv } from './db-structure'

export function get_arango_persistence_factory(env: ArangoDbSecEnv) {
  const dbStruct = getDbStruct(env.database_connections)
  const modelImpl: moo.model.impl = {
    userAccount: NO_JOB_HERE,
  }
  return { modelImpl, dbStruct }
}
