import { email_address } from '@moodle/lib-types'
import { createNewUserRecordData } from '@moodle/mod-iam/lib'
import * as migrations from './migrate/from'
import { user_record2userDocument } from './sec/db-arango-iam-lib/mappings'
import { ArangoDbSecEnv, db_struct, getDbStruct } from './db-structure'

const TARGET_V = migrations.v0_1.VERSION

export interface Env {
  moodlesysAdminEmail: email_address
}

export async function migrateArangoDB(
  { database_connections }: ArangoDbSecEnv,
  env: Env,
): Promise<string> {
  const db_struct = getDbStruct(database_connections)
  const isInit = !(await db_struct.mng.db.exists())

  if (isInit) {
    await db_struct.sys_db.createDatabase(db_struct.mng.db.name)
    await db_struct.mng.coll.migrations.create()
  }
  return upgrade({ db_struct }).then(async final_version => {
    if (isInit) {
      const default_admin_db_user = await createNewUserRecordData({
        displayName: 'Admin',
        email: env.moodlesysAdminEmail,
        passwordHash: '##UNSET##',
        roles: ['admin', 'publisher'],
      })
      console.log('initializing default admin user')

      await db_struct.iam.coll.user.save(user_record2userDocument(default_admin_db_user))
    }
    return final_version
  })
}

export async function upgrade({ db_struct }: { db_struct: db_struct }): Promise<string> {
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
