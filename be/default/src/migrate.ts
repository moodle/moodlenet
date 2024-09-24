import { migrate as migrateArangoDb } from '@moodle/sec-db-arango/migrate'
import { migrate_fn } from './types'

export const migrate: migrate_fn = async ({ env, configs }) => {
  const version = await migrateArangoDb(env.arango_db, configs.db)
  console.log(`arangodb persistence version: ${version}`)
  return version
}
