import { v0_1 as iam_v0_1 } from '@moodle/mod-iam'
import { Database } from 'arangojs'
import { Migration_Record } from '../../migrate/types'

export type dbConn = {
  url: string
  dbname: string
}

export type dbs_struct_configs_0_1 = {
  mng: dbConn
  data: dbConn
  iam: dbConn
}

export interface Migration_0_1 extends Migration_Record<'0_1'> {
  meta: 'initialization'
}

export type db_struct_0_1 = ReturnType<typeof struct_0_1>
export default function struct_0_1(dbs_struct_configs_0_1: dbs_struct_configs_0_1) {
  const data_db = new Database({
    url: dbs_struct_configs_0_1.data.url,
    databaseName: dbs_struct_configs_0_1.data.dbname,
  })
  const iam_db = new Database({
    url: dbs_struct_configs_0_1.iam.url,
    databaseName: dbs_struct_configs_0_1.iam.dbname,
  })
  const mng_db = new Database({
    url: dbs_struct_configs_0_1.mng.url,
    databaseName: dbs_struct_configs_0_1.mng.dbname,
  })
  return {
    dbs_struct_configs_0_1,
    mng: {
      db: mng_db,
      coll: {
        module_configs: mng_db.collection('module_configs'),
        migrations: mng_db.collection('migrations'),
      },
    },
    data: {
      db: data_db,
      coll: {},
    },
    iam: {
      db: iam_db,
      coll: {
        user: iam_db.collection<iam_v0_1.DbUser>('user'),
      },
    },
  }
}
