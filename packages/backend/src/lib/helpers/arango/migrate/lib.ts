import { Database } from 'arangojs'
import semverRCompare from 'semver/functions/rcompare'
import semverValid from 'semver/functions/valid'
import { getAllResults, getOneResult } from '../../arango'
import { addMigrationRecordQ, getMigrationHistoryQ, MIGRATIONS_COLLECTION } from './queries'
import { MigrationRecord, Version, VersionLadder } from './types'

export const addMigrationRecord = (version: Version) => async (db: Database) => {
  const date = new Date().toISOString() as any as Date
  const record: MigrationRecord = {
    version,
    date,
  }
  const q = addMigrationRecordQ(record)
  return getOneResult(q, db)
}

export const getMigrationHistory = () => async (db: Database) => {
  const q = getMigrationHistoryQ()
  const migrations = (await getAllResults(q, db)) as MigrationRecord[]
  return migrations
    .map<MigrationRecord>(migr => ({
      date: new Date(migr.date),
      version: migr.version,
    }))
    .sort(({ date: a }, { date: b }) => (a < b ? 1 : a > b ? -1 : 0))
}

export const isSetUp = () => async (db: Database) => db.collection(MIGRATIONS_COLLECTION).exists()

export const setUp = () => async (db: Database) => {
  if (await isSetUp()(db)) {
    return
  }
  await db.createCollection(MIGRATIONS_COLLECTION)
}

export const getDBLatestMigrationRecord = () => async (db: Database) => (await getMigrationHistory()(db))[0]

export const getDBVersionCompare =
  ({ version }: { version: Version }) =>
  async (db: Database) => {
    const latestMigration = await getDBLatestMigrationRecord()(db)
    return latestMigration ? semverRCompare(version, latestMigration.version) : null
  }

export const isDBAtVersion =
  ({ version }: { version: Version }) =>
  async (db: Database) =>
    (await getDBVersionCompare({ version })(db)) === 0

export const stepDB =
  ({ ladder, dir }: { ladder: VersionLadder; dir: 'up' | 'down' }) =>
  async ({ db }: { db: Database }) => {
    const latestRecord = await getDBLatestMigrationRecord()(db)
    if (!latestRecord) {
      throw new Error(`No version history present`)
    }
    const latestVersion = latestRecord.version
    console.log(`latest DB version: ${latestVersion}`)
    const latestUpdater = ladder[latestVersion]
    if (!latestUpdater) {
      throw new Error(`no updater found for latest version ${latestVersion}!`)
    }

    const target_version_updater = climbLadder(ladder, latestVersion, dir)

    if (!target_version_updater) {
      return false
    }
    const [targetVersion, targetVersionUpdater] = target_version_updater

    console.log(`DB targetVersion: ${targetVersion}`)

    if (dir === 'up') {
      if ('initialSetUp' in targetVersionUpdater) {
        throw new Error(`found an "initialSetup" updater for next version ${targetVersion}!`)
      }
      console.log(`calling updater`)
      await targetVersionUpdater.pullUp(db)
      console.log(`add migration record`)
      await addMigrationRecord(targetVersion)(db)
      return
    } else {
      if ('initialSetUp' in latestUpdater) {
        return false
      }

      console.log(`calling updater`)
      await latestUpdater.pushDown(db)
      console.log(`add migration record`)
      await addMigrationRecord(targetVersion)(db)
      return
    }
  }

export const climbLadder = (ladder: VersionLadder, from: Version, dir: 'up' | 'down') => {
  const ladderVersionsSorted = getLadderVersionSorted(ladder)
  console.log(`ladderVersionsSorted: ${ladderVersionsSorted}`)

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
    await setUp()(db)
    console.log(`db initial setup`)
    await firstVersionUpdater.initialSetUp(db)
    console.log(`adding migration record`)
    await addMigrationRecord(firstVersion)(db)
  }
