import { Database } from 'arangojs'
import { db_struct_0_1, Migration_0_1 } from '../../dbStructure/0_1'

export const VERSION = 'v0_1'
export async function migrate({ db_struct_0_1 }: { db_struct_0_1: db_struct_0_1 }) {
  // create databases

  const data_db_sys = new Database(db_struct_0_1.dbs_struct_configs_0_1.data.url)
  await data_db_sys.createDatabase(db_struct_0_1.data.db.name)
  const iam_db_sys = new Database(db_struct_0_1.dbs_struct_configs_0_1.iam.url)
  await iam_db_sys.createDatabase(db_struct_0_1.iam.db.name)

  // create collections
  // mng
  await db_struct_0_1.mng.coll.module_configs.create({ cacheEnabled: true })
  // iam
  await db_struct_0_1.iam.coll.user.create({})
  // data
  //  await db_struct_0_1.data.coll.xxx.create({})

  // bump_version
  const migrationDoc: Migration_0_1 = {
    v: '0_1',
    previous: 'null',
    current: VERSION,
    date: new Date().toISOString(),
    meta: 'initialization',
  }

  return migrationDoc
}
