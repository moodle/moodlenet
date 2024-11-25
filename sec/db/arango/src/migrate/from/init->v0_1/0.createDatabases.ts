import { dbStruct } from '../../../db-structure'
// import { removePropOnInsert } from '../lib/id'

export async function createDatabases({ dbStruct }: { dbStruct: dbStruct }) {
  // create databases

  // ~~~`await dbStruct.sys_db.createDatabase(dbStruct.modules.db.name)~~~ this is created in migrate.ts
  await dbStruct.sys_db.createDatabase(dbStruct.appData.db.name)
  await dbStruct.sys_db.createDatabase(dbStruct.identity.db.name)

  await Promise.all(
    [dbStruct.sys_db, dbStruct.appData.db, dbStruct.logs.db, dbStruct.identity.db].map(db =>
      db.createFunction(
        'MOODLE::RESTORE_RECORD_ID',
        `(doc) => ({
          ...Object.fromEntries(Object.entries(doc).filter(([prop]) => !prop.startsWith('_'))),
          [doc._key_prop]: doc._key
        })`,
      ),
    ),
  )
}
