import { GlobalSearchNodeType } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { getAllResults } from '../../../../lib/helpers/arango/query'
import { Adapter } from '../../../../ports/content-graph/search'
import { globalSearchQuery } from '../aql/globalSearch'
import { aqlGraphNode2GraphNode, forwardSkipLimitPage } from '../aql/helpers'
import { ContentGraphDB } from '../types'

export const globalSearch = (db: ContentGraphDB): Adapter => ({
  searchNodes: async ({ nodeTypes, page, sortBy, text }) => {
    const { query, skip } = globalSearchQuery({ nodeTypes, page, sortBy, text })
    const aqlGraphNodes = await getAllResults(query, db)
    const docs = aqlGraphNodes.map(_ => aqlGraphNode2GraphNode<GlobalSearchNodeType>(_))
    const globSearchPage = forwardSkipLimitPage({ docs, skip })
    return globSearchPage
  },
})
