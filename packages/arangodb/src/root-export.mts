import { ensure } from './lib/collections.mjs'
import { getPkgDBName } from './lib/db.mjs'
import { queryDb } from './lib/query.mjs'
import shell from './shell.mjs'
import { CollectionDefOptMap, QueryReq } from './types.mjs'

export async function ensureCollections({ defs }: { defs: CollectionDefOptMap }) {
  const callerPkgId = shell.assertCallInitiator()
  const dbName = getPkgDBName(callerPkgId)
  return ensure(dbName, { defs })
}

export async function query(queryReq: QueryReq) {
  const callerPkgId = shell.assertCallInitiator()
  const dbName = getPkgDBName(callerPkgId)
  return queryDb(dbName, queryReq)
}
