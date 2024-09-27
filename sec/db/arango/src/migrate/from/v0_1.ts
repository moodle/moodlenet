import { db_struct } from '../../db-structure'
import { Migration_Record } from '../types'

export const VERSION = 'v0_2'
export async function migrate({ db_struct }: { db_struct: db_struct }) {
  await db_struct.iam.db.query(
    `
FOR user in @@userCollection
  UPDATE user WITH {
    createdAt: user.activityStatus.lastLogin
  } IN @@userCollection`,
    {
      '@userCollection': db_struct.iam.coll.user.name,
    },
  )
  // bump_version
  const migrationDoc: Migration_Record = {
    previous: 'v0_1',
    current: VERSION,
    date: new Date().toISOString(),
    meta: 'add iam#user.createdAt',
  }

  return migrationDoc
}
