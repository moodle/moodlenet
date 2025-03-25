import { logger } from '@moodle/domain'
import { databaseConnections, dbStruct, getDbStruct } from './db-structure'
import * as dbUpgrades from './dbUpgrade/from'

const TARGET_V = 'v0_1'

export async function upgradeArangoDB({ log, databaseConnections }: { databaseConnections: databaseConnections; log: logger }): Promise<string> {
  const dbStruct = getDbStruct(databaseConnections)
  const isInit = !(await dbStruct.services.db.exists())

  if (isInit) {
    await dbStruct.sys_db.createDatabase(dbStruct.services.db.name)
    await dbStruct.services.coll.dbUpgrade.create()
  }
  return upgrade({ dbStruct, log }).then(async final_version => {
    return final_version
  })
}

export async function upgrade({ dbStruct, log }: { dbStruct: dbStruct; log: logger }): Promise<string> {
  const from_v = ((await dbStruct.services.coll.dbUpgrade.document('latest', { graceful: true }))?.current ?? 'init') as keyof typeof dbUpgrades | typeof TARGET_V

  if (from_v === TARGET_V) {
    log.info(`current arangodb persistence version: [${TARGET_V}]`)
    return TARGET_V
  }

  const upgradeMod = dbUpgrades[from_v]
  if (!upgradeMod) {
    const errorMessage = `upgrade from [${from_v}] not found`
    log.emergency(errorMessage)
    throw new Error(errorMessage)
  }

  const upgradeDoc = await upgradeMod.upgrade({ dbStruct })

  await dbStruct.services.coll.dbUpgrade.saveAll(
    [
      {
        _key: `${upgradeDoc.previous}::${upgradeDoc.current}`,
        ...upgradeDoc,
      },
      {
        _key: 'latest',
        ...upgradeDoc,
      },
    ],
    { overwriteMode: 'replace' },
  )

  log.info(`upgraded arangodb persistence from [${from_v}] to [${upgradeMod.VERSION}]`)
  return upgrade({ dbStruct, log })
}
