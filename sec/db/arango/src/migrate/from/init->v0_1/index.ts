import { date_time_string } from '@moodle/lib-types'
import { dbStruct } from '../../../db-structure'
import { Migration_Record } from '../../types'
import { createDatabases } from './0.createDatabases'
import { createCollections } from './1.createCollections'
import { insertModConfigs } from './2.insertModConfigs'
// import { removePropOnInsert } from '../lib/id'

export const VERSION = 'v0_1'
export async function migrate({ dbStruct }: { dbStruct: dbStruct }) {
  await createDatabases({ dbStruct })
  await createCollections({ dbStruct })
  await insertModConfigs({ dbStruct })

  // bump_version
  const migrationDoc: Migration_Record = {
    previous: 'null',
    current: VERSION,
    date: date_time_string('now'),
    meta: 'initialization',
  }

  return migrationDoc
}
