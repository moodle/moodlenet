import { dbStruct } from '../../../db-structure'
// import { removePropOnInsert } from '../lib/id'

export async function createDatabases({ dbStruct }: { dbStruct: dbStruct }) {
  // create databases

  // ~~~`await dbStruct.sys_db.createDatabase(dbStruct.modules.db.name)~~~ this is created in migrate.ts
  await dbStruct.sys_db.createDatabase(dbStruct.moodlenet.db.name)
  await dbStruct.sys_db.createDatabase(dbStruct.userAccount.db.name)


  await Promise.all(
    [dbStruct.sys_db, dbStruct.moodlenet.db, dbStruct.modules.db, dbStruct.userAccount.db].map(db =>
      db.createFunction(
        'MOODLE::RESTORE_RECORD',
        `(doc) => ({
      ...Object.fromEntries(Object.entries(doc).filter(([prop]) => !prop.startsWith('_'))),
      id: doc._key,
    })`,
      ),
    ),
  )
}
