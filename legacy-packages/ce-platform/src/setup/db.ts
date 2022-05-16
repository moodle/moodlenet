import contentGraphLadder from '@moodlenet/backend/dist/adapters/content-graph/arangodb/db/maintainance/ladder'
import userAuthLadder from '@moodlenet/backend/dist/adapters/user-auth/arangodb/db/maintainance/ladder'
import { initializeDB, upgradeToLatest } from '@moodlenet/backend/dist/lib/helpers/arango/migrate/lib'
import { Database } from 'arangojs'
import { DBEnv } from '../env/db'

export const setupDb = async ({
  actionOnDBExists,
  env: { arangoUrl, contentGraphDBName, userAuthDBName },
}: {
  actionOnDBExists: 'abort' | 'upgrade' // | 'drop'
  env: DBEnv
}) => {
  const sys_db = new Database({ url: arangoUrl })

  console.log(`initializing ContentGraphDB`)
  await initializeDB({ dbname: contentGraphDBName, ladder: contentGraphLadder, actionOnDBExists })({
    sys_db,
  })

  console.log(`initializing UserAuthDB`)
  await initializeDB({ dbname: userAuthDBName, ladder: userAuthLadder, actionOnDBExists })({
    sys_db,
  })
}

export const upgradeToLatestDb = async ({ env: { arangoUrl, contentGraphDBName, userAuthDBName } }: { env: DBEnv }) => {
  const contentGraphDB = new Database({ url: arangoUrl, databaseName: contentGraphDBName })
  const userAuthDB = new Database({ url: arangoUrl, databaseName: userAuthDBName })

  console.log(`upgrading ContentGraphDB`)
  await upgradeToLatest({ ladder: contentGraphLadder })({ db: contentGraphDB })

  console.log(`upgrading UserAuthDB`)
  await upgradeToLatest({ ladder: userAuthLadder })({ db: userAuthDB })
}
