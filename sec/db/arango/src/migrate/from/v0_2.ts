import { db_struct } from '../../db-structure'
import { Migration_Record } from '../types'

export const VERSION = 'v0_3'
export async function migrate({ db_struct }: { db_struct: db_struct }) {
  await db_struct.data.coll.userHome.create({})
  await db_struct.data.coll.userHome.ensureIndex({ type: 'persistent', fields: ['userId'] })
  // bump_version
  const migrationDoc: Migration_Record = {
    previous: 'v0_2',
    current: VERSION,
    date: new Date().toISOString(),
    meta: 'created userHome collection & configs + index on userId',
  }

  return migrationDoc
}
