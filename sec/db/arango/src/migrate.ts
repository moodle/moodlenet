import { Logger } from '@moodle/domain'
import { databaseConnections, dbStruct, getDbStruct } from './db-structure'
import * as migrations from './migrate/from'

const TARGET_V = 'v0_3'

export async function migrateArangoDB({
  log,
  databaseConnections,
}: {
  databaseConnections: databaseConnections
  log: Logger
}): Promise<string> {
  const dbStruct = getDbStruct(databaseConnections)
  const isInit = !(await dbStruct.modules.db.exists())

  if (isInit) {
    await dbStruct.sys_db.createDatabase(dbStruct.modules.db.name)
    await dbStruct.modules.coll.migrations.create()
  }
  return upgrade({ dbStruct, log }).then(async final_version => {
    return final_version
  })
}

export async function upgrade({ dbStruct, log }: { dbStruct: dbStruct; log: Logger }): Promise<string> {
  const from_v: keyof typeof migrations | typeof TARGET_V =
    (await dbStruct.modules.coll.migrations.document('latest', { graceful: true }))?.current ?? 'init'

  if (from_v === TARGET_V) {
    log('info', `current arangodb persistence version: [${TARGET_V}]`)
    return TARGET_V
  }

  const migrateMod = migrations[from_v]
  if (!migrateMod) {
    const errorMessage = `migration from [${from_v}] not found`
    log('emergency', errorMessage)
    throw new Error(errorMessage)
  }

  const migrationDoc = await migrateMod.migrate({ dbStruct })

  await dbStruct.modules.coll.migrations.saveAll(
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

  log('info', `migrated arangodb persistence from [${from_v}] to [${migrateMod.VERSION}]`)
  return upgrade({ dbStruct, log })
}
