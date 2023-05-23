import type { AqlQuery, QueryOptions } from '@moodlenet/arangodb/server'
import { getMyDB } from '@moodlenet/arangodb/server'
import { shell } from '../shell.mjs'
import type { AqlVal } from '../types.mjs'

export const { db } = await shell.call(getMyDB)()
export function querySysEntitiesDB<T>(
  { bindVars, query, returnStatement }: AqlQuery & { returnStatement: AqlVal<T> },
  options?: QueryOptions,
) {
  return db.query<T>(
    {
      query: `${query}
RETURN ${returnStatement}`,
      bindVars,
    },
    options,
  )
}
