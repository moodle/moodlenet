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

export const SEARCH_VIEW_NAME = 'SearchView'
export const SearchAliasView = (await db.view(SEARCH_VIEW_NAME).exists())
  ? db.view(SEARCH_VIEW_NAME)
  : await db.createView(SEARCH_VIEW_NAME, {
      type: 'arangosearch',
    })

const textAnalyzer = db.analyzer('global-text-search')
await textAnalyzer.create({
  type: 'text',
  properties: {
    case: 'upper',
    locale: 'en',
    stemming: true,
    edgeNgram: { max: 8, min: 3, preserveOriginal: true },
  },
  features: ['frequency', 'norm', 'position'],
})
