import { logger } from '@moodle/domain'
import { databaseConnections, dbStruct, getDbStruct } from './db-structure'
import * as migrations from './migrate/from'

const TARGET_V = 'v0_1'

export async function migrateArangoDB({
  log,
  databaseConnections,
}: {
  databaseConnections: databaseConnections
  log: logger
}): Promise<string> {
  const dbStruct = getDbStruct(databaseConnections)
  const isInit = !(await dbStruct.services.db.exists())

  if (isInit) {
    await dbStruct.sys_db.createDatabase(dbStruct.services.db.name)
    await dbStruct.services.coll.dbMigrations.create()
  }
  return upgrade({ dbStruct, log }).then(async final_version => {
    return final_version
  })
}

export async function upgrade({ dbStruct, log }: { dbStruct: dbStruct; log: logger }): Promise<string> {
  const from_v = ((await dbStruct.services.coll.dbMigrations.document('latest', { graceful: true }))?.current ?? 'init') as
    | keyof typeof migrations
    | typeof TARGET_V

  if (from_v === TARGET_V) {
    log.info(`current arangodb persistence version: [${TARGET_V}]`)
    return TARGET_V
  }

  const migrateMod = migrations[from_v]
  if (!migrateMod) {
    const errorMessage = `migration from [${from_v}] not found`
    log.emergency(errorMessage)
    throw new Error(errorMessage)
  }

  const migrationDoc = await migrateMod.migrate({ dbStruct })

  await dbStruct.services.coll.dbMigrations.saveAll(
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

  log.info(`migrated arangodb persistence from [${from_v}] to [${migrateMod.VERSION}]`)
  return upgrade({ dbStruct, log })
}
