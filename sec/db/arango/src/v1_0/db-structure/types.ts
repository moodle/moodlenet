import { Migration_Record } from '../../migrate/types'
import type { getDbStruct } from './struct'
export type db_struct = ReturnType<typeof getDbStruct>

export interface ArangoDbSecEnv {
  dbs_struct_configs: dbs_struct_configs
}
export type dbConn = {
  url: string
  dbname: string
}

export type dbs_struct_configs = {
  mng: dbConn
  data: dbConn
  iam: dbConn
}
export interface Migration extends Migration_Record<'v1_0'> {
  meta: 'initialization'
}
