import { defApi } from '@moodlenet/core'
import { ensure } from './lib/collections.mjs'
import { getPkgDBName } from './lib/db.mjs'
import { query } from './lib/query.mjs'
import { CollectionDefOptMap, QueryReq } from './types.mjs'

export default {
  xx: defApi(
    ctx =>
      async ({ defs }: { defs: CollectionDefOptMap }) => {
        return 100
      },
    () => true,
    //{noPrimary:true}
  ),
  ensureCollections: defApi(
    ctx =>
      async ({ defs }: { defs: CollectionDefOptMap }) => {
        const dbName = getPkgDBName(ctx.caller.pkgId)
        return ensure(dbName, { defs })
      },
    () => true,
    //{noPrimary:true}
  ),
  query: defApi(
    ctx => async (queryReq: QueryReq) => {
      const dbName = getPkgDBName(ctx.caller.pkgId)
      return query(dbName, queryReq)
    },
    () => true,
    //{noPrimary:true}
  ),
}
