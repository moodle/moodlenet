import { Database } from 'arangojs'
import struct_v1_0, { db_struct_v1_0 } from './dbStructure/v1_0'
import * as migrations from './migrate/from'
import { ArangoDbSecEnv } from './types'

const TARGET_V = migrations.init.VERSION

export async function migrate({ dbs_struct_configs_v1_0 }: ArangoDbSecEnv): Promise<string> {
  const db_struct_v1_0 = struct_v1_0(dbs_struct_configs_v1_0)
  const self_db_exists = await db_struct_v1_0.mng.db.exists()
  if (!self_db_exists) {
    const mng_db_sys = new Database(db_struct_v1_0.dbs_struct_configs_v1_0.mng.url)
    await mng_db_sys.createDatabase(db_struct_v1_0.mng.db.name)
    await db_struct_v1_0.mng.coll.migrations.create()
  }
  return upgrade({ db_struct_v1_0 })
}

export async function upgrade({
  db_struct_v1_0,
}: {
  db_struct_v1_0: db_struct_v1_0
}): Promise<string> {
  const from_v: keyof typeof migrations | typeof TARGET_V =
    (await db_struct_v1_0.mng.coll.migrations.document('latest', { graceful: true }))?.current ??
    'init'

  if (from_v === TARGET_V) {
    console.log(`current arangodb persistence version: [${TARGET_V}]`)
    return TARGET_V
  }

  const migrateMod = migrations[from_v]
  if (!migrateMod) {
    throw new Error(`migration from [${from_v}] not found`)
  }

  const migrationDoc = await migrateMod.migrate({ db_struct_v1_0 })

  await db_struct_v1_0.mng.coll.migrations.saveAll(
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
  return upgrade({ db_struct_v1_0 })
}
