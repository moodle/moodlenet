import { Database } from 'arangojs'
import { QMDeployer } from '../../../../lib/qmino/types'
import { search } from '../../../../ports/queries/content-graph/global-search'
import { globalSearchQuery, makeGlobalSearchGQLSearchPage } from '../lib/globalSearch'
import { getAllResults } from '../lib/helpers'

export const globalSearch = (db: Database): QMDeployer<typeof search> => [
  (action /* , args, port */) => {
    // return port(...args)({
    return action({
      searchNodes: async ({ nodeTypes, page, sortBy, text }) => {
        const { query, skip } = globalSearchQuery({ nodeTypes, page, sortBy, text })
        const documents = await getAllResults(query, db)
        const searchPageResult = makeGlobalSearchGQLSearchPage({ documents, skip })
        return searchPageResult
      },
    })
  },
  async () => {},
]
