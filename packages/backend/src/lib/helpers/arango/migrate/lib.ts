import { Database } from 'arangojs'
import { ArangoError } from 'arangojs/error'
import semverRCompare from 'semver/functions/rcompare'
import { getAllResults, getOneResult } from '../query'
import { climbLadder, getLadderVersionSorted } from './ladder'
import { addMigrationRecordQ, getMigrationHistoryQ, MIGRATIONS_COLLECTION } from './queries'
import { DBWorker, MigrationRecord, Version, VersionedDB, VersionLadder } from './types'

export const addMigrationRecord =
  <V extends string>(version: Version<V>) =>
  async ({ db }: { db: Database }) => {
    const date = new Date().toISOString() as any as Date
    const record: MigrationRecord<V> = {
      version,
      date,
    }
    const q = addMigrationRecordQ(record)
    return getOneResult(q, db)
  }

export const getMigrationHistory = async ({ db }: { db: Database }) => {
  if (!(await isMigrationCollectionSetUp({ db }))) {
    return null
  }
  const q = getMigrationHistoryQ()
  const migrations = (await getAllResults(q, db)) as MigrationRecord<Version>[]
  return migrations.map<MigrationRecord<Version>>(migr => ({
    date: new Date(migr.date),
    version: migr.version,
  }))
}

export const isMigrationCollectionSetUp = async ({ db }: { db: Database }) =>
  db.collection(MIGRATIONS_COLLECTION).exists()

export const setUpMigrationCollection = async ({ db }: { db: Database }) => {
  if (await isMigrationCollectionSetUp({ db })) {
    return
  }
  await db.createCollection(MIGRATIONS_COLLECTION)
}

export const getDBLatestMigrationRecord = async ({ db }: { db: Database }) => {
  const m_hist = await getMigrationHistory({ db })
  return m_hist ? m_hist[0] : null
}

export const getDBVersionCompare =
  ({ version }: { version: Version }) =>
  async ({ db }: { db: Database }) => {
    const latestMigration = await getDBLatestMigrationRecord({ db })
    return latestMigration ? semverRCompare(version, latestMigration.version) : null
  }

export const isDBAtVersion =
  ({ version }: { version: Version }) =>
  async ({ db }: { db: Database }) =>
    (await getDBVersionCompare({ version })({ db })) === 0

export const isDBAtLatestVersion = async ({ db }: { db: Database }) => {
  const latestVersion = await getDBLatestVersion({ db })
  return isDBAtVersion({ version: latestVersion })({ db })
}

export const getVersionedDB =
  <V extends Version>({ version }: { version: V }) =>
  async ({ db }: { db: Database }) => {
    const isAtV = await isDBAtVersion({ version })({ db })
    if (!isAtV) {
      return null
    }
    ;(db as any).__v__ = version
    return db as VersionedDB<V>
  }
export const getVersionedDBOrThrow =
  <V extends Version>({ version }: { version: V }) =>
  async ({ db }: { db: Database }) => {
    const vdb = await getVersionedDB({ version })({ db })
    if (!vdb) {
      throw new Error(`db [${db.name}] should be at version ${version}`)
    }
    return vdb
  }

export const getDBLatestVersion = async ({ db }: { db: Database }) => {
  const latestRecord = await getDBLatestMigrationRecord({ db })
  if (!latestRecord) {
    throw new Error(`No version history present`)
  }
  return latestRecord.version
}
export const stepDB =
  ({ ladder, dir }: { ladder: VersionLadder; dir: 'up' | 'down' }) =>
  async ({ db }: { db: Database }) => {
    const latestVersion = await getDBLatestVersion({ db })
    console.log(`stepDB: latest DB version: ${latestVersion}`)
    const latestUpdater = ladder[latestVersion]
    if (!latestUpdater) {
      throw new Error(`no updater found for latest version ${latestVersion}!`)
    }

    const target_version_updater = climbLadder(ladder, latestVersion, dir)

    if (!target_version_updater) {
      return [latestVersion, latestVersion, false] as const
    }
    const [targetVersion, targetVersionUpdater] = target_version_updater

    if (semverRCompare(targetVersion, latestVersion) === 0) {
      return [latestVersion, targetVersion, false] as const
    }

    console.log(`stepDB: DB targetVersion: ${targetVersion}`)

    let updater: DBWorker

    if (dir === 'up') {
      if ('initialSetUp' in targetVersionUpdater) {
        throw new Error(`next version ${targetVersion} updater is an initilizer ! can't pull up !`)
      }
      updater = targetVersionUpdater.pullUp
    } else {
      if ('initialSetUp' in latestUpdater) {
        throw new Error(`current version ${targetVersion} updater is an initializer ! can't push down !`)
      }
      updater = latestUpdater.pushDown
    }
    console.log(`calling [${dir}] updater from version ${latestVersion} to ${targetVersion}`)
    try {
      await updater({ db })
      console.log(`addding migration record`)
      await addMigrationRecord(targetVersion)({ db })
      return [latestVersion, targetVersion, true] as const
    } catch (e) {
      if (e instanceof ArangoError) {
        console.error('ArangoError', {
          code: e.code,
          errorNum: e.errorNum,
          message: e.message,
          // response: e.response,
          name: e.name,
        })
      }
      console.error(`StepDB Error :\n${e instanceof Error ? e.stack : e}`)
      throw e
    }
  }

export const upgradeToLatest =
  ({ ladder }: { ladder: VersionLadder }) =>
  async ({ db }: { db: Database }) => {
    const versions = getLadderVersionSorted(ladder)
    const lastVersion = versions[0]!
    return stepDBTo({ ladder, targetVersion: lastVersion })({ db })
  }

export const stepDBTo =
  ({ ladder, targetVersion }: { ladder: VersionLadder; targetVersion: Version }) =>
  async ({ db }: { db: Database }): Promise<Version> => {
    if (!(targetVersion in ladder)) {
      throw new Error(`no [${targetVersion}] version in ladder`)
    }
    const latestVersion = await getDBLatestVersion({ db })

    const versionCompare = semverRCompare(latestVersion, targetVersion)
    console.log(`\nstepDBTo : check versions ${latestVersion}->${targetVersion}`)
    if (versionCompare === 0) {
      console.log(`stepDBTo: version up to date, exit`)
      return targetVersion
    }
    const dir = versionCompare === 1 ? 'up' : 'down'
    console.log(`updating direction : ${dir}`)

    return stepDB({ dir, ladder })({ db }).then(([, toVersion, done]) => {
      if (!done) {
        console.log(`\nstepDBTo: didn't perform stopped at ${toVersion}`)
        return toVersion
      }
      if (semverRCompare(toVersion, targetVersion) === 0) {
        console.log(`\nstepDBTo: migrate properly to ${targetVersion}`)
        return targetVersion
      }
      return stepDBTo({ ladder, targetVersion })({ db })
    })
  }

export const initializeDB =
  ({
    dbname,
    ladder,
    actionOnDBExists,
  }: {
    dbname: string
    ladder: VersionLadder
    actionOnDBExists: 'abort' | 'upgrade' // | 'drop'
  }) =>
  async ({ sys_db }: { sys_db: Database }) => {
    const exists = await sys_db.database(dbname).exists()
    if (exists) {
      if (actionOnDBExists === 'abort') {
        throw new Error(`db ${dbname} exists, abort`)
      }
      // if (actionOnDBExists === 'drop') {
      //   console.log(`db ${dbname} exists, dropping`)
      //   await sys_db.dropDatabase(dbname)
      // }
    }

    const db = sys_db.database(dbname)

    if (!exists) {
      //  || actionOnDBExists === 'drop'){
      const versions = getLadderVersionSorted(ladder)
      const firstVersion = versions.reverse()[0]!
      const firstVersionUpdater = ladder[firstVersion]

      console.log(`first version in ladder: ${firstVersion}`)
      if (!firstVersionUpdater || !('initialSetUp' in firstVersionUpdater)) {
        throw new Error(`can't find an "initialSetup" for lowest version ${firstVersion}!`)
      }

      console.log(`creating db ${dbname}`)
      await sys_db.createDatabase(dbname)
      console.log(`initializing db ${dbname}`)

      console.log(`setup migration collection`)
      await setUpMigrationCollection({ db })

      console.log(`db initial version`)
      await firstVersionUpdater.initialSetUp({ db }).catch(async e => {
        await sys_db.dropDatabase(dbname)
        throw e
      })

      console.log(`adding migration record`)
      await addMigrationRecord(firstVersion)({ db })
    }
    const version = await upgradeToLatest({ ladder })({ db })
    await db.close()
    return version
  }
