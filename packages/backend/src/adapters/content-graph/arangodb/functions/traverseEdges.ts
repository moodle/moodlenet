import { GraphEdgeType } from '@moodlenet/common/lib/content-graph/types/edge'
import { GraphNode, GraphNodeType } from '@moodlenet/common/lib/content-graph/types/node'
import { PageItem } from '@moodlenet/common/lib/content-graph/types/page'
import { aq, aqlstr } from '../../../../lib/helpers/arango/query'
import { TraverseFromNodeInput } from '../../../../ports/content-graph/traverseNodeRel'
import { AqlGraphEdge, AqlGraphNode } from '../types'
// import { getNodeOpAqlAssertions } from './assertions/node'
import { cursorPaginatedQuery, documentBySlugType } from './helpers'

export const traverseEdgesQ = ({
  edgeType,
  page,
  targetNodeType,
  inverse,
  /* env, */
  fromNode,
}: TraverseFromNodeInput<GraphNodeType, GraphEdgeType>) => {
  // const targetIdsFilter =
  //   targetNodeIds && targetNodeIds.length ? `&& edge._${targetSide} IN [${targetNodeIds.map(aqlstr).join(',')}]` : ''

  const queryMapper = traversePaginateMapQuery({
    edgeType,
    parentNode: fromNode,
    inverse,
    targetNodeType,
  })

  return cursorPaginatedQuery({
    cursorProp: `edge._key`,
    page,
    inverseSort: true,
    mapQuery: queryMapper,
  })
}

export const traversePaginateMapQuery =
  ({
    // edgeAndNodeAssertionFilters,
    edgeType,
    parentNode,
    additionalFilter,
    targetNodeType,
    inverse,
  }: {
    edgeType: string
    targetNodeType: GraphNodeType
    inverse: boolean
    parentNode: Pick<GraphNode, '_slug' | '_type'>
    additionalFilter?: string
    // edgeAndNodeAssertionFilters: string
  }) =>
  (pageFilterSortLimit: string) => {
    const targetSide = inverse ? 'from' : 'to'
    const parentSide = inverse ? 'to' : 'from'
    return aq<PageItem<{ edge: AqlGraphEdge; node: AqlGraphNode }>>(`
      let parentNode = ${documentBySlugType(parentNode)}
      FOR edge IN ${edgeType}
        FILTER edge._${targetSide}Type == ${aqlstr(targetNodeType)}
          && edge._${parentSide} == parentNode._id
          //&& !$ {isMarkDeleted('edge')}
          ${additionalFilter ? `&& ${additionalFilter}` : ''}
          
          ${pageFilterSortLimit}
        
        LET targetNode = Document(edge._${targetSide})

        RETURN  [
          cursor,
          {
            edge,
            node: targetNode
          }
        ]
      `)
  }
