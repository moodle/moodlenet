import { getAllResults } from '../../../../lib/helpers/arango'
import { Adapter } from '../../../../ports/content-graph/search'
import { globalSearchQuery, makeGlobalSearchGQLSearchPage } from '../functions/globalSearch'
import { ContentGraphDB } from '../types'

export const globalSearch = (db: ContentGraphDB): Adapter => ({
  searchNodes: async ({ nodeTypes, page, sortBy, text }) => {
    const { query, skip } = globalSearchQuery({ nodeTypes, page, sortBy, text })
    const documents = await getAllResults(query, db)
    const searchPageResult = makeGlobalSearchGQLSearchPage({ documents, skip })
    return searchPageResult
  },
})
