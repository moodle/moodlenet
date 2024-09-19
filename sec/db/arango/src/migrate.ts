import { v1_0 } from '.'
import * as migrations from './migrate/from'

const TARGET_V = migrations.v0_1.VERSION

export async function migrate({ database_connections }: v1_0.ArangoDbSecEnv): Promise<string> {
  const db_struct = v1_0.getDbStruct(database_connections)
  const self_db_exists = await db_struct.mng.db.exists()

  if (!self_db_exists) {
    await db_struct.sys_db.createDatabase(db_struct.mng.db.name)
    await db_struct.mng.coll.migrations.create()
  }
  return upgrade({ db_struct })
}

export async function upgrade({ db_struct }: { db_struct: v1_0.db_struct }): Promise<string> {
  const from_v: keyof typeof migrations | typeof TARGET_V =
    (await db_struct.mng.coll.migrations.document('latest', { graceful: true }))?.current ?? 'init'

  if (from_v === TARGET_V) {
    console.log(`current arangodb persistence version: [${TARGET_V}]`)
    return TARGET_V
  }

  const migrateMod = migrations[from_v]
  if (!migrateMod) {
    throw new Error(`migration from [${from_v}] not found`)
  }

  const migrationDoc = await migrateMod.migrate({ db_struct: db_struct })

  await db_struct.mng.coll.migrations.saveAll(
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
  return upgrade({ db_struct: db_struct })
}
