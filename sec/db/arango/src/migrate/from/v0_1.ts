import { db_struct } from '../../db-structure'
import { Migration_Record } from '../types'

export const VERSION = 'v0_2'
export async function migrate({ db_struct }: { db_struct: db_struct }) {
  await db_struct.userAccount.db.query(
    `
FOR user in @@userCollection
  UPDATE user WITH {
    createdAt: user.activityStatus.lastLogin
  } IN @@userCollection`,
    {
      '@userCollection': db_struct.userAccount.coll.user.name,
    },
  )
  // bump_version
  const migrationDoc: Migration_Record = {
    previous: 'v0_1',
    current: VERSION,
    date: new Date().toISOString(),
    meta: 'add userAccount#user.createdAt',
  }

  return migrationDoc
}
