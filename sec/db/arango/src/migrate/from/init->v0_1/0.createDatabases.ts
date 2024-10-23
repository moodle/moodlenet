import { dbStruct } from '../../../db-structure'
// import { removePropOnInsert } from '../lib/id'

export async function createDatabases({ dbStruct }: { dbStruct: dbStruct }) {
  // create databases

  await dbStruct.sys_db.createDatabase(dbStruct.data.db.name)
  await dbStruct.sys_db.createDatabase(dbStruct.userAccount.db.name)
}
