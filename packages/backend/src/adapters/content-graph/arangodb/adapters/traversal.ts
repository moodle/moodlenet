import { mapPageItem } from '@moodlenet/common/lib/content-graph/types/page'
import { getAllResults } from '../../../../lib/helpers/arango/query'
import { NodeRelationCountAdapter, TraverseNodeRelAdapter } from '../../../../ports/content-graph/traverseNodeRel'
import { aqlGraphEdge2GraphEdge, aqlGraphNode2GraphNode, makeAfterBeforePage } from '../functions/helpers'
import { traverseEdgesQ } from '../functions/traverseEdges'
import { AqlGraphEdge, AqlGraphNode, ContentGraphDB } from '../types'

const pageItemMapper = mapPageItem(({ edge, node }: { edge: AqlGraphEdge; node: AqlGraphNode }) => ({
  node: aqlGraphNode2GraphNode(node),
  edge: aqlGraphEdge2GraphEdge(edge),
}))
export const getTraverseNodeRelAdapter = (db: ContentGraphDB): TraverseNodeRelAdapter => ({
  async traverseNodeRelations(input) {
    const { afterPageQuery, beforePageQuery } = traverseEdgesQ(input)
    const afterItems = (afterPageQuery ? await getAllResults(afterPageQuery, db) : []).map(pageItemMapper)
    const beforeItems = (beforePageQuery ? await getAllResults(beforePageQuery, db) : []).map(pageItemMapper)
    const page = makeAfterBeforePage({
      afterItems,
      beforeItems,
    })
    return page
  },
})

export const getNodeRelationCountAdapter = (_db: ContentGraphDB): NodeRelationCountAdapter => ({
  async traverseNodeRelations() {
    return 12
  },
})
