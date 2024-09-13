import { v1_0 as iam_v1_0 } from '@moodle/mod-iam'
import { Database } from 'arangojs'
import { dbs_struct_configs } from './types'

export function getDbStruct(dbs_struct_configs: dbs_struct_configs) {
  const data_db = new Database({
    url: dbs_struct_configs.data.url,
    databaseName: dbs_struct_configs.data.dbname,
  })
  const iam_db = new Database({
    url: dbs_struct_configs.iam.url,
    databaseName: dbs_struct_configs.iam.dbname,
  })
  const mng_db = new Database({
    url: dbs_struct_configs.mng.url,
    databaseName: dbs_struct_configs.mng.dbname,
  })
  return {
    dbs_struct_configs,
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
