import { v1_0 } from '../..'

export const VERSION = 'v0_2'
export async function migrate({ db_struct }: { db_struct: v1_0.db_struct }) {
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
  const migrationDoc: v1_0.Migration = {
    v: 'v1_0',
    previous: 'v0_1',
    current: VERSION,
    date: new Date().toISOString(),
    meta: 'add iam#user.createdAt',
  }

  return migrationDoc
}
