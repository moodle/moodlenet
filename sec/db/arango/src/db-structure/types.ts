import { Config as ArangoConnectionConfig } from 'arangojs/connection'
import type { getDbStruct } from './struct'
export type dbStruct = ReturnType<typeof getDbStruct>

export interface ArangoDbSecEnv {
  database_connections: databaseConnections
}

export type dbConnection = ArangoConnectionConfig

export type databaseConnections = {
  modules: dbConnection
  data: dbConnection
  userAccount: dbConnection
}
