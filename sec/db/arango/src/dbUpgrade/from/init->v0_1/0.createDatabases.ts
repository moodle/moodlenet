import { dbStruct } from '../../../db-structure'
// import { removePropOnInsert } from '../lib/id'

export async function createDatabases({ dbStruct }: { dbStruct: dbStruct }) {
  // create databases

  // ~~~`await dbStruct.sys_db.createDatabase(dbStruct.modules.db.name)~~~ this is created in dbUpgrade.ts
  await dbStruct.sys_db.createDatabase(dbStruct.appData.db.name)
}
