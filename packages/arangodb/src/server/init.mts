import type { PkgIdentifier } from '@moodlenet/core'
import type { DocumentCollection } from 'arangojs/collection.js'
import type { Config } from 'arangojs/connection.js'
import { Database } from 'arangojs/database.js'
import { shell } from './shell.mjs'

export const env = getEnv()

export const sysDB = new Database({ ...env.connectionCfg })
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

function getEnv(): Env {
  const config = shell.config
  // FIXME: validate configs
  const env: Env = config
  return env
}

type Env = { connectionCfg: Config }
