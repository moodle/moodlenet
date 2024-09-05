import { Database } from 'arangojs'
import { Migration_Record } from '../../migrate/types'

export type dbs_struct_configs_0_1 = {
  data: { url: string; dbname: string }
  iam: { url: string; dbname: string }
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
  return {
    dbs_struct_configs_0_1,
    data: {
      db: data_db,
      coll: {
        module_configs: data_db.collection('module_configs'),
        self: {
          migrations: data_db.collection('self_db_migrations'),
        },
      },
    },
    iam: {
      db: iam_db,
      coll: {
        user: iam_db.collection('user'),
      },
    },
  }
}
