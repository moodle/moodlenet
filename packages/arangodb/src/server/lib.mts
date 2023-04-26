import { DocumentCollection } from 'arangojs/collection.js'
import { ensureDB, ensureDocCollection, getPkgDBName } from './init.mjs'
import { shell } from './shell.mjs'

export async function getMyDB() {
  const { pkgId: callerPkgId } = shell.assertCallInitiator()
  const dbName = getPkgDBName(callerPkgId)
  return ensureDB(dbName)
}

export async function ensureDocumentCollection<T extends Record<string, any>>(
  collectionName: string,
): Promise<{ collection: DocumentCollection<T>; newlyCreated: boolean }> {
  const { db } = await getMyDB()
  const { collection, newlyCreated } = await ensureDocCollection<T>(db, collectionName)
  return { collection, newlyCreated }
}
