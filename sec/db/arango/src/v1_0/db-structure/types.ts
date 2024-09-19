import { Config as ArangoConnectionConfig } from 'arangojs/connection'
import { Migration_Record } from '../../migrate/types'
import type { getDbStruct } from './struct'
import { _any } from '@moodle/lib-types'
export type db_struct = ReturnType<typeof getDbStruct>

export interface ArangoDbSecEnv {
  database_connections: database_connections
}

export type db_connection = ArangoConnectionConfig

export type database_connections = {
  mng: db_connection
  data: db_connection
  iam: db_connection
}

export interface Migration extends Migration_Record<'v1_0'> {
  meta: _any
}
