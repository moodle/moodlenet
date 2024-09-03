import struct_0_1, { dbs_struct_configs_0_1 } from './dbStructure/0_1'
import initialize from './migrate/from/init'

export async function migrate({
  dbs_struct_configs_0_1,
}: {
  dbs_struct_configs_0_1: dbs_struct_configs_0_1
}) {
  const target_v = '0_1'
  const db_struct_0_1 = struct_0_1(dbs_struct_configs_0_1)
  const data_db_exists = await db_struct_0_1.data.db.exists()
  const iam_db_exists = await db_struct_0_1.iam.db.exists()
  if (!data_db_exists && !iam_db_exists) {
    console.log(`initializing arangodb persistence to v${target_v}`)
    return initialize({ db_struct_0_1 }).then(() => migrate({ dbs_struct_configs_0_1 }))
  }
  if (!data_db_exists || !iam_db_exists) {
    throw new Error(`arangodb seems to be corrupted: either data_db or iam_db do not exist`)
  }

  const from_v = (await db_struct_0_1.data.coll.self.migrations.document('latest')).current
  if (from_v === target_v) {
    console.log(`current arangodb persistence version: v${target_v}`)
  } else {
    console.log(`migrate arangodb persistence from v${from_v} to v${target_v}`)
  }
}
