import { Config as ArangoConnectionConfig } from 'arangojs/connection'
import type { getDbStruct } from './struct'
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
