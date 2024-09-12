import { Database } from 'arangojs'
import struct_0_1, { db_struct_0_1 } from './dbStructure/v0_1'
import * as migrations from './migrate/from'
import { ArangoDbSecEnv } from './types'

const TARGET_V = migrations.init.VERSION

export async function migrate({ dbs_struct_configs_0_1 }: ArangoDbSecEnv): Promise<string> {
  const db_struct_0_1 = struct_0_1(dbs_struct_configs_0_1)
  const self_db_exists = await db_struct_0_1.mng.db.exists()
  if (!self_db_exists) {
    const mng_db_sys = new Database(db_struct_0_1.dbs_struct_configs_0_1.mng.url)
    await mng_db_sys.createDatabase(db_struct_0_1.mng.db.name)
    await db_struct_0_1.mng.coll.migrations.create()
  }
  return upgrade({ db_struct_0_1 })
}

export async function upgrade({
  db_struct_0_1,
}: {
  db_struct_0_1: db_struct_0_1
}): Promise<string> {
  const from_v: keyof typeof migrations | typeof TARGET_V =
    (await db_struct_0_1.mng.coll.migrations.document('latest', { graceful: true }))?.current ??
    'init'

  if (from_v === TARGET_V) {
    console.log(`current arangodb persistence version: [${TARGET_V}]`)
    return TARGET_V
  }

  const migrateMod = migrations[from_v]
  if (!migrateMod) {
    throw new Error(`migration from [${from_v}] not found`)
  }

  const migrationDoc = await migrateMod.migrate({ db_struct_0_1 })

  await db_struct_0_1.mng.coll.migrations.saveAll(
    [
      {
        _key: `${migrationDoc.previous}::${migrationDoc.current}`,
        ...migrationDoc,
      },
      {
        _key: 'latest',
        ...migrationDoc,
      },
    ],
    { overwriteMode: 'replace' },
  )

  console.log(`migrated arangodb persistence from [${from_v}] to [${migrateMod.VERSION}]`)
  return upgrade({ db_struct_0_1 })
}
