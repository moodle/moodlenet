import { Database } from 'arangojs'
import contentGraphLadder from '../../adapters/content-graph/arangodb/db/maintainance/ladder'
import userAuthLadder from '../../adapters/user-auth/arangodb/db/maintainance/ladder'
import { initializeDB, upgradeToLatest } from '../../lib/helpers/arango/migrate/lib'
import { MNStaticEnv } from '../../lib/types'
import { DBEnv } from '../env/db'
import mnStatic from '../env/mnStatic'

export const setupDb = async ({
  actionOnDBExists,
  env: { arangoUrl, contentGraphDBName, userAuthDBName },
}: {
  actionOnDBExists: 'drop' | 'abort' | 'upgrade'
  env: DBEnv
}) => {
  const sys_db = new Database({ url: arangoUrl })

  console.log(`initializing ContentGraphDB`)
  await initializeDB<MNStaticEnv>({ dbname: contentGraphDBName, ladder: contentGraphLadder, actionOnDBExists })({
    sys_db,
    ctx: mnStatic,
  })

  console.log(`initializing UserAuthDB`)
  await initializeDB<MNStaticEnv>({ dbname: userAuthDBName, ladder: userAuthLadder, actionOnDBExists })({
    sys_db,
    ctx: mnStatic,
  })
}

export const upgradeToLatestDb = async ({ env: { arangoUrl, contentGraphDBName, userAuthDBName } }: { env: DBEnv }) => {
  const contentGraphDB = new Database({ url: arangoUrl, databaseName: contentGraphDBName })
  const userAuthDB = new Database({ url: arangoUrl, databaseName: userAuthDBName })

  console.log(`upgrading ContentGraphDB`)
  await upgradeToLatest<MNStaticEnv>({ ladder: contentGraphLadder })({ db: contentGraphDB, ctx: mnStatic })

  console.log(`upgrading UserAuthDB`)
  await upgradeToLatest<MNStaticEnv>({ ladder: userAuthLadder })({ db: userAuthDB, ctx: mnStatic })
}
