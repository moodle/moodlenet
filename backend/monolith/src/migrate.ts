import { migrate as migrateArangoDb } from '@moodle/sec-db-arango/migrate'
import { Env } from './types'

export async function migrate({ env }: { env: Env }) {
  const version = await migrateArangoDb(env.arango_db)
  console.log(`arangodb persistence version: ${version}`)
  return version
}
