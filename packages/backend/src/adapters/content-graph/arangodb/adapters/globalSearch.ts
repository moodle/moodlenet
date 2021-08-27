import { GlobalSearchNodeType } from '@moodlenet/common/lib/content-graph/types/global-search'
import { getAllResults } from '../../../../lib/helpers/arango/query'
import { Adapter } from '../../../../ports/content-graph/search'
import { globalSearchQuery } from '../aql/globalSearch'
import { aqlGraphNode2GraphNode, forwardSkipLimitPage } from '../aql/helpers'
import { ContentGraphDB } from '../types'

export const globalSearch = (db: ContentGraphDB): Adapter => ({
  searchNodes: async ({ nodeTypes, page, sort, text }) => {
    type _NodeType = typeof nodeTypes
    type NodeType = _NodeType extends GlobalSearchNodeType[] ? _NodeType[number] : GlobalSearchNodeType
    console.log({ nodeTypes, page, sort, text })
    const { query, skip } = globalSearchQuery<NodeType>({ nodeTypes, page, sort, text })
    const aqlGraphNodes = await getAllResults(query, db)
    const docs = aqlGraphNodes.map(_ => aqlGraphNode2GraphNode<NodeType>(_))
    const globSearchPage = forwardSkipLimitPage({ docs, skip })
    return globSearchPage
  },
})
