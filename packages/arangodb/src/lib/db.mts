import { PkgIdentifier } from '@moodlenet/core'
import { sysDB } from '../main.mjs'

export async function ensureDB(dbName: string) {
  const exists = (await sysDB.databases()).find(db => db.name === dbName)
  const db = exists ?? (await sysDB.createDatabase(dbName))
  return { created: !exists, db }
}

export function getPkgDBName({ name: pkgName }: PkgIdentifier) {
  return pkgName[0] === '@' ? pkgName.replace('@', 'at__').replace('/', '__') : pkgName
}
