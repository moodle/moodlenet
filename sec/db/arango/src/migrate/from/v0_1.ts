import { aql } from 'arangojs'
import { db_struct } from '../../db-structure'
import { Migration_Record } from '../types'

export const VERSION = 'v0_2'
export async function migrate({ db_struct }: { db_struct: db_struct }) {
  await db_struct.userAccount.db.query(
    aql`
FOR user in ${db_struct.userAccount.coll.user}
  UPDATE user WITH {
    creationDate: user.activityStatus.lastLogin
  } IN ${db_struct.userAccount.coll.user}
`,
  )
  // bump_version
  const migrationDoc: Migration_Record = {
    previous: 'v0_1',
    current: VERSION,
    date: new Date().toISOString(),
    meta: 'add userAccount#user.creationDate',
  }

  return migrationDoc
}
