import { email_address } from '@moodle/lib-types'
import { createNewDbUserData } from '@moodle/mod-iam/v1_0/lib'
import assert from 'assert'
import { v1_0 } from '.'
import * as migrations from './migrate/from'
import { ArangoDbSecEnv } from './v1_0'

const TARGET_V = migrations.v0_1.VERSION

export interface DbMigrateConfig {
  init?: { moodleInitialAdminEmail: email_address }
}

export async function migrate(
  { database_connections }: ArangoDbSecEnv,
  dbMigrateConfig: DbMigrateConfig,
): Promise<string> {
  const db_struct = v1_0.getDbStruct(database_connections)
  const isInit = !(await db_struct.mng.db.exists())

  if (isInit) {
    if (!dbMigrateConfig.init?.moodleInitialAdminEmail) {
      throw new Error('an email for the default admin user is required for first db initialization')
    }
    await db_struct.sys_db.createDatabase(db_struct.mng.db.name)
    await db_struct.mng.coll.migrations.create()
  }
  return upgrade({ db_struct }).then(async final_version => {
    if (isInit) {
      assert(
        dbMigrateConfig.init?.moodleInitialAdminEmail,
        'default_admin_email is required for first db initialization',
      )
      console.log('initializing default admin user')
      const default_admin_db_user = await createNewDbUserData({
        displayName: 'Admin',
        email: dbMigrateConfig.init.moodleInitialAdminEmail,
        passwordHash: '##UNSET##',
        roles: ['admin'],
      })

      await db_struct.iam.coll.user.save(default_admin_db_user)
    }
    return final_version
  })
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
