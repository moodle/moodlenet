import { Database } from 'arangojs'
import semverRCompare from 'semver/functions/rcompare'
import semverValid from 'semver/functions/valid'
import { getAllResults, getOneResult } from '../../arango'
import { addMigrationRecordQ, getMigrationHistoryQ, MIGRATIONS_COLLECTION } from './queries'
import { DBWorker, MigrationRecord, Version, VersionLadder } from './types'

export const addMigrationRecord =
  (version: Version) =>
  async ({ db }: { db: Database }) => {
    const date = new Date().toISOString() as any as Date
    const record: MigrationRecord = {
      version,
      date,
    }
    const q = addMigrationRecordQ(record)
    return getOneResult(q, db)
  }

export const getMigrationHistory =
  () =>
  async ({ db }: { db: Database }) => {
    const q = getMigrationHistoryQ()
    const migrations = (await getAllResults(q, db)) as MigrationRecord[]
    return migrations.map<MigrationRecord>(migr => ({
      date: new Date(migr.date),
      version: migr.version,
    }))
  }

export const isSetUp =
  () =>
  async ({ db }: { db: Database }) =>
    db.collection(MIGRATIONS_COLLECTION).exists()

export const setUp =
  () =>
  async ({ db }: { db: Database }) => {
    if (await isSetUp()({ db })) {
      return
    }
    await db.createCollection(MIGRATIONS_COLLECTION)
  }

export const getDBLatestMigrationRecord =
  () =>
  async ({ db }: { db: Database }) =>
    (await getMigrationHistory()({ db }))[0]

export const getDBVersionCompare =
  ({ version }: { version: Version }) =>
  async ({ db }: { db: Database }) => {
    const latestMigration = await getDBLatestMigrationRecord()({ db })
    return latestMigration ? semverRCompare(version, latestMigration.version) : null
  }

export const isDBAtVersion =
  ({ version }: { version: Version }) =>
  async (db: Database) =>
    (await getDBVersionCompare({ version })({ db })) === 0

export const stepDB =
  ({ ladder, dir }: { ladder: VersionLadder; dir: 'up' | 'down' }) =>
  async ({ db }: { db: Database }) => {
    const latestRecord = await getDBLatestMigrationRecord()({ db })
    if (!latestRecord) {
      throw new Error(`No version history present`)
    }
    const latestVersion = latestRecord.version
    console.log(`\nstepDB: latest DB version: ${latestVersion}`)
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

    console.log(`\nstepDB: DB targetVersion: ${targetVersion}`)

    let updater: DBWorker

    if (dir === 'up') {
      if ('initialSetUp' in targetVersionUpdater) {
        throw new Error(`found an "initialSetup" updater for next version ${targetVersion}!`)
      }
      updater = targetVersionUpdater.pullUp
    } else {
      if ('initialSetUp' in latestUpdater) {
        throw new Error(`found an "initialSetup" updater for next version ${targetVersion}!`)
      }
      updater = latestUpdater.pushDown
    }
    console.log(`calling updater`)
    await updater({ db })
    console.log(`add migration record`)
    await addMigrationRecord(targetVersion)({ db })
    return [latestVersion, targetVersion, true] as const
  }

export const climbLadder = (ladder: VersionLadder, from: Version, dir: 'up' | 'down') => {
  const ladderVersionsSorted = getLadderVersionSorted(ladder)

  const currVersionIndex = ladderVersionsSorted.indexOf(from)
  const requestedVersion = ladderVersionsSorted[currVersionIndex + (dir === 'up' ? -1 : 1)] as Version | undefined
  if (!requestedVersion) {
    return null
  }
  return [requestedVersion, ladder[requestedVersion]!] as const
}

export const getLadderVersionSorted = (ladder: VersionLadder) => {
  const ladderVersionsStrs = Object.keys(ladder)
  const invalidSemvers = ladderVersionsStrs.filter(_ => !semverValid(_))
  if (invalidSemvers.length) {
    throw new Error(`Ladder contains invalid semvers : ${invalidSemvers.join(' ; ')}`)
  }
  const ladderVersionsSorted = Object.keys(ladder).sort(semverRCompare)
  console.log(`ladderVersionsSorted: ${ladderVersionsSorted.join(' <- ')}`)

  return ladderVersionsSorted
}

export const initialSetUp =
  ({ ladder }: { ladder: VersionLadder }) =>
  async ({ db }: { db: Database }) => {
    const firstVersion = getLadderVersionSorted(ladder).reverse()[0]! as Version
    const firstVersionUpdater = ladder[firstVersion]
    if (!firstVersionUpdater || !('initialSetUp' in firstVersionUpdater)) {
      throw new Error(`can't find an "initialSetup" for lowest version ${firstVersion}!`)
    }
    console.log(`first version: ${firstVersion}`)
    console.log(`setup migration collection`)
    await setUp()({ db })
    console.log(`db initial setup`)
    await firstVersionUpdater.initialSetUp({ db })
    console.log(`adding migration record`)
    await addMigrationRecord(firstVersion)({ db })
  }

export const stepDBTo =
  ({ ladder, targetVersion }: { ladder: VersionLadder; targetVersion: Version }) =>
  async ({ db }: { db: Database }): Promise<Version> => {
    if (!(targetVersion in ladder)) {
      throw new Error(`no [${targetVersion}] version in ladder`)
    }
    const latestRecord = await getDBLatestMigrationRecord()({ db })
    if (!latestRecord) {
      throw new Error(`no existing version history`)
    }
    const { version: latestVersion } = latestRecord
    const versionCompare = semverRCompare(latestVersion, targetVersion)
    console.log(`\nstepDBTo : check versions ${latestVersion}->${targetVersion}`)
    if (versionCompare === 0) {
      console.log(`stepDBTo: same version exit`)
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
        console.log(`\nstepDBTo: done properly ${targetVersion}`)
        return targetVersion
      }
      return stepDBTo({ ladder, targetVersion })({ db })
    })
  }
