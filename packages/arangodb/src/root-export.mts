import * as collectionLib from './lib/collections.mjs'
import { getPkgDBName } from './lib/db.mjs'
import { queryDbRs } from './lib/query.mjs'
import shell from './shell.mjs'
import { CreateCollectionDefsMap, CreateCollectionOptsMap, QueryReq } from './types.mjs'
export * from './types.mjs'

export async function ensureCollections<Defs extends CreateCollectionDefsMap>({
  defs,
}: {
  defs: CreateCollectionOptsMap<Defs>
}) {
  const { pkgId: callerPkgId } = shell.assertCallInitiator()
  const dbName = getPkgDBName(callerPkgId)
  return collectionLib.ensureCollections(dbName, { defs })
}

export async function queryRs(queryReq: QueryReq) {
  const { pkgId: callerPkgId } = shell.assertCallInitiator()
  const dbName = getPkgDBName(callerPkgId)
  return queryDbRs(dbName, queryReq)
}
