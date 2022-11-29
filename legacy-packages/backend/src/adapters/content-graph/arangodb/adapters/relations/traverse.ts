import { getAllResults } from '../../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../../lib/plug'
import { adapter } from '../../../../../ports/content-graph/relations/traverse'
import { makeAfterBeforePage } from '../../aql/helpers'
import { traverseEdgesQ } from '../../aql/queries/traverseEdges'
import { ContentGraphDB } from '../../types'

// const pageItemMapper = mapPageItem(({ edge, node }: { edge: AqlGraphEdge; node: AqlGraphNode }) => ({
//   node: aqlGraphNode2GraphNode(node),
//   edge: aqlGraphEdge2GraphEdge(edge),
// }))

export const arangoTraverseNodeRelationsAdapter =
  (db: ContentGraphDB): SockOf<typeof adapter> =>
  async input => {
    const { afterPageQuery, beforePageQuery } = traverseEdgesQ(input)
    const afterItems = afterPageQuery ? await getAllResults(afterPageQuery, db) : []
    const beforeItems = beforePageQuery ? await getAllResults(beforePageQuery, db) : []
    // console.log('afterPageQuery\n', afterPageQuery)
    // const afterItems = afterItemsQres.map(pageItemMapper)
    // const beforeItems = beforeItemsQres.map(pageItemMapper)
    const page = makeAfterBeforePage({
      afterItems,
      beforeItems,
    })
    return page
  }
