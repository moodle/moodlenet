import { DocumentCollection } from 'arangojs/collection.js'
import * as sysDB from './init/sysDb.mjs'
import shell from './shell.mjs'

export async function getMyDB() {
  const { pkgId: callerPkgId } = shell.assertCallInitiator()
  const dbName = sysDB.getPkgDBName(callerPkgId)
  return sysDB.ensureDB(dbName)
}

export async function ensureDocumentCollection<T extends Record<string, any>>(
  collectionName: string,
): Promise<{ collection: DocumentCollection<T>; newlyCreated: boolean }> {
  const { db } = await getMyDB()
  const { collection, newlyCreated } = await sysDB.ensureDocumentCollection<T>(db, collectionName)
  return { collection, newlyCreated }
}
