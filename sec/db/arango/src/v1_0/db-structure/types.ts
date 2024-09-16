import { Config as ArangoConnectionConfig } from 'arangojs/connection'
import { Migration_Record } from '../../migrate/types'
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
export interface Migration extends Migration_Record<'v1_0'> {
  meta: 'initialization'
}

// in env-provider.mjs:
const c: db_connection = {
  arangoVersion: 31000,
  url: 'http://',
  databaseName: 'mng',
  auth: { username: 'root', password: 'klaslksklasklsaklas' },
  keepalive: true,
  retryOnConflict: 5,
  precaptureStackTraces: true, // in development
  maxRetries: 5,
  // poolSize:5,
  // responseQueueTimeSamples:5,
  // credentials,
  // headers,
  // loadBalancingStrategy,
  // afterResponse,
  // beforeRequest
}
