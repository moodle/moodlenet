import { v1_0 as iam_v1_0 } from '@moodle/mod-iam'
import { Database } from 'arangojs'
import { database_connections } from './types'

export function getDbStruct(database_connections: database_connections) {
  const data_db = new Database(database_connections.data)
  const iam_db = new Database(database_connections.iam)
  const mng_db = new Database(database_connections.mng)
  const sys_db = new Database({ ...database_connections.mng, databaseName: '_system' })

  return {
    connections: database_connections,
    sys_db,
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
