import { primary_session } from '@moodle/domain'
import { map } from '@moodle/lib-types'
import { migrate as migrateArangoDb } from '@moodle/sec-db-arango/migrate'
import { EnvType } from './types'

const migrations: map<Promise<string>> = {}
export function migrate(primary_session: primary_session, env: EnvType) {
  if (migrations[primary_session.domain]) {
    return migrations[primary_session.domain]
  }
  const migrateTask = migrateArangoDb(env.arango_db).then(version => {
    console.log(`arangodb persistence version: ${version} for domain ${primary_session.domain}`)
    return version
  })
  migrations[primary_session.domain] = migrateTask
  migrateTask
}
