import { v1_0 as iam_v1_0 } from '@moodle/mod-iam'
import { Database } from 'arangojs'
import { Migration_Record } from '../../migrate/types'

export type dbConn = {
  url: string
  dbname: string
}

export type dbs_struct_configs_v1_0 = {
  mng: dbConn
  data: dbConn
  iam: dbConn
}

export interface Migration_v1_0 extends Migration_Record<'v1_0'> {
  meta: 'initialization'
}

export type db_struct_v1_0 = ReturnType<typeof struct_v1_0>
export default function struct_v1_0(dbs_struct_configs_v1_0: dbs_struct_configs_v1_0) {
  const data_db = new Database({
    url: dbs_struct_configs_v1_0.data.url,
    databaseName: dbs_struct_configs_v1_0.data.dbname,
  })
  const iam_db = new Database({
    url: dbs_struct_configs_v1_0.iam.url,
    databaseName: dbs_struct_configs_v1_0.iam.dbname,
  })
  const mng_db = new Database({
    url: dbs_struct_configs_v1_0.mng.url,
    databaseName: dbs_struct_configs_v1_0.mng.dbname,
  })
  return {
    dbs_struct_configs_v1_0,
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
        user: iam_db.collection<iam_v1_0.DbUser>('user'),
      },
    },
  }
}
