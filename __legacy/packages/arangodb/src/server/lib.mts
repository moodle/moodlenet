import type { PkgIdentifier } from '@moodlenet/core'
import type { Database } from 'arangojs'
import type { DocumentCollection } from 'arangojs/collection.js'
import { sysDB } from './init/sys-db.mjs'
import { shell } from './shell.mjs'

export async function ensureDB(dbName: string) {
  const db = sysDB.database(dbName)
  const exists = await db.exists()
  if (!exists) {
    await sysDB.createDatabase(dbName)
  }
  return { db }
}

export function getPkgDBName(pkgId: PkgIdentifier) {
  return `${pkgId.name.replace(/^@/, '').replace('/', '__')}`
}

export async function ensureDocCollection<T extends Record<string, any>>(
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
