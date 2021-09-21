import { mapPageItem } from '@moodlenet/common/lib/content-graph/types/page'
import { getAllResults, getOneResult } from '../../../../lib/helpers/arango/query'
import { NodeRelationCountAdapter, TraverseNodeRelAdapter } from '../../../../ports/content-graph/traverseNodeRel'
import { aqlGraphEdge2GraphEdge, aqlGraphNode2GraphNode, getOneAQFrag, makeAfterBeforePage } from '../aql/helpers'
import { getAqlNodeByGraphNodeIdentifierQ } from '../aql/queries/getNode'
import { nodeRelationCountQ, traverseEdgesQ } from '../aql/queries/traverseEdges'
import { AqlGraphEdge, AqlGraphNode, ContentGraphDB } from '../types'

const pageItemMapper = mapPageItem(({ edge, node }: { edge: AqlGraphEdge; node: AqlGraphNode }) => ({
  node: aqlGraphNode2GraphNode(node),
  edge: aqlGraphEdge2GraphEdge(edge),
}))

export const getTraverseNodeRelAdapter = (db: ContentGraphDB): TraverseNodeRelAdapter => ({
  async traverseNodeRelations(input) {
    const { afterPageQuery, beforePageQuery } = traverseEdgesQ(input)
    const afterItemsQres = afterPageQuery ? await getAllResults(afterPageQuery, db) : []
    const beforeItemsQres = beforePageQuery ? await getAllResults(beforePageQuery, db) : []
    // console.log({ afterPageQuery, beforePageQuery, afterItemsQres, beforeItemsQres })
    const afterItems = afterItemsQres.map(pageItemMapper)
    const beforeItems = beforeItemsQres.map(pageItemMapper)
    const page = makeAfterBeforePage({
      afterItems,
      beforeItems,
    })
    return page
  },
})

export const getNodeRelationCountAdapter = (db: ContentGraphDB): NodeRelationCountAdapter => ({
  async countNodeRelations({ edgeType, fromNode, inverse, targetNodeType /* , env  */ }) {
    const q = nodeRelationCountQ({
      edgeType,
      inverse,
      targetNodeType,
      parentNodeId: `${getOneAQFrag(getAqlNodeByGraphNodeIdentifierQ(fromNode))}._id`,
    })
    return (await getOneResult(q, db)) || 0
  },
})
