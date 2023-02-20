import { PkgIdentifier } from '@moodlenet/core'
import { DocumentCollection } from 'arangojs/collection.js'
import { Database } from 'arangojs/database.js'
import { env } from '../env.mjs'

export const sysDB = new Database({ ...env.connectionCfg })
export async function ensureDB(dbName: string) {
  const exists = (await sysDB.databases()).find(db => db.name === dbName)
  const db = exists ?? (await sysDB.createDatabase(dbName))
  return { db }
}

export function getPkgDBName(pkgId: PkgIdentifier) {
  return `${pkgId.name.replace(/^@/, '').replace('/', '__')}`
}

export async function ensureDocumentCollection<T extends Record<string, any>>(
  db: Database,
  collectionName: string,
): Promise<{ collection: DocumentCollection<T>; newlyCreated: boolean }> {
  const collection = await db.collection<T>(collectionName)
  const exists = await collection.exists()
  if (!exists) {
    await db.createCollection<T>(collectionName)
  }
  return { collection, newlyCreated: !exists }
}

// export async function ensureDocumentCollection(
//   db: Database,
//   collectionName: string,
// ): Promise<DocumentCollection> {
//   const list = await db.listCollections(true)
//   const foundCollection = list.find(({ name }) => name === collectionName)
//   const collection = foundCollection
//     ? db.collection(foundCollection.name)
//     : db.createCollection(collectionName)
//   return collection
// }
