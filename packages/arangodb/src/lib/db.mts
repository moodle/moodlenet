import { PkgIdentifier } from '@moodlenet/core'
import { Database } from 'arangojs/database.js'
import { env } from '../env.mjs'

export const sysDB = new Database({ ...env.connectionCfg })
export async function ensureDB(dbName: string) {
  const exists = (await sysDB.databases()).find(db => db.name === dbName)
  const db = exists ?? (await sysDB.createDatabase(dbName))
  return { created: !exists, db }
}

export function getPkgDBName(pkgId: PkgIdentifier) {
  return `${pkgId.name.replace(/^@/, '').replace('/', '__')}`
}
