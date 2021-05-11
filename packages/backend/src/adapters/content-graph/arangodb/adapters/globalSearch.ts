import { Database } from 'arangojs'
import { Adapter } from '../../../../ports/content-graph/search'
import { globalSearchQuery, makeGlobalSearchGQLSearchPage } from '../functions/globalSearch'
import { getAllResults } from '../functions/helpers'

export const globalSearch = (db: Database): Adapter => ({
  searchNodes: async ({ nodeTypes, page, sortBy, text }) => {
    const { query, skip } = globalSearchQuery({ nodeTypes, page, sortBy, text })
    const documents = await getAllResults(query, db)
    const searchPageResult = makeGlobalSearchGQLSearchPage({ documents, skip })
    return searchPageResult
  },
})
