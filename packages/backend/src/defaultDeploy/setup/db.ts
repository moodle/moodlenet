import { Database } from 'arangojs'
import contentGraphLadder from '../../adapters/content-graph/arangodb/db/maintainance/ladder'
import userAuthLadder from '../../adapters/user-auth/arangodb/db/maintainance/ladder'
import { initializeDB } from '../../lib/helpers/arango/migrate/lib'
import { DBEnv } from '../env/db'

export const setupDb = async ({
  forceDrop,
  env: { arangoUrl, contentGraphDBName, userAuthDBName },
}: {
  forceDrop: boolean
  env: DBEnv
}) => {
  const sys_db = new Database({ url: arangoUrl })

  console.log(`initializing ContentGraphDB`)
  await initializeDB({ dbname: contentGraphDBName, ladder: contentGraphLadder, forceDrop })({ sys_db })

  console.log(`initializing UserAuthDB`)
  await initializeDB({ dbname: userAuthDBName, ladder: userAuthLadder, forceDrop })({ sys_db })
}

export default setupDb
