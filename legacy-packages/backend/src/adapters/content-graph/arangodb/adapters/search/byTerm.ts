import { GlobalSearchNodeType } from '@moodlenet/common/dist/content-graph/types/global-search'
import { getAllResults } from '../../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../../lib/plug'
import { adapter } from '../../../../../ports/content-graph/search/byTerm'
import { globalSearchQuery } from '../../aql/globalSearch'
import { forwardSkipLimitPage } from '../../aql/helpers'
import { ContentGraphDB } from '../../types'

export const arangoSearchByTermAdapter =
  (db: ContentGraphDB): SockOf<typeof adapter> =>
  async ({ nodeTypes, page, sort, text, assertions, publishedOnly }) => {
    type _NodeType = typeof nodeTypes
    type NodeType = _NodeType extends GlobalSearchNodeType[] ? _NodeType[number] : GlobalSearchNodeType
    // console.log({ nodeTypes, page, sort, text })
    const { query, skip } = globalSearchQuery<NodeType>({ nodeTypes, page, sort, text, assertions, publishedOnly })
    const docs = await getAllResults(query, db)
    // const docs = aqlGraphNodes.map(_ => aqlGraphNode2GraphNode<NodeType>(_))
    const globSearchPage = forwardSkipLimitPage({ docs, skip })
    return globSearchPage
  }
