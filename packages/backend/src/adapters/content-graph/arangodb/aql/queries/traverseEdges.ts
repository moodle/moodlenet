import { BV } from '@moodlenet/common/lib/content-graph/bl/graph-lang'
import { GraphEdgeType } from '@moodlenet/common/lib/content-graph/types/edge'
import { GraphNode, GraphNodeType } from '@moodlenet/common/lib/content-graph/types/node'
import { PageItem } from '@moodlenet/common/lib/content-graph/types/page'
import { Maybe } from '@moodlenet/common/lib/utils/types'
import { aq, aqlstr } from '../../../../../lib/helpers/arango/query'
import { TraverseFromNodeAdapterInput } from '../../../../../ports/content-graph/traverseNodeRel'
import { _ } from '../../bl/baseOperators'
import { AqlGraphEdge, AqlGraphNode } from '../../types'
// import { getNodeOpAqlAssertions } from './assertions/node'
import { cursorPaginatedQuery } from '../helpers'

export const traverseEdgesQ = ({
  edgeType,
  page,
  targetNodeType,
  inverse,
  /* env, */
  fromNode,
  targetIds,
}: TraverseFromNodeAdapterInput) => {
  // const targetIdsFilter =
  //   targetNodeIds && targetNodeIds.length ? `&& edge._${targetSide} IN [${targetNodeIds.map(aqlstr).join(',')}]` : ''
  // console.log('********************', { edgeType, targetNodeType, fromNode, targetIds })

  const queryMapper = traversePaginateMapQuery({
    edgeType,
    fromNode,
    inverse,
    targetNodeType,
    targetIds,
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
    fromNode,
    additionalFilter,
    targetNodeType,
    inverse,
    targetIds,
  }: {
    edgeType: GraphEdgeType
    targetNodeType: GraphNodeType
    inverse: boolean
    fromNode: BV<GraphNode | null>
    additionalFilter?: string
    targetIds: Maybe<BV<GraphNode | null>[]>
    // edgeAndNodeAssertionFilters: string
  }) =>
  (pageFilterSortLimit: string) => {
    // console.log('********************', { targetIds })
    if (targetIds && !targetIds.length) {
      return aq<PageItem<{ edge: AqlGraphEdge; node: AqlGraphNode }>>(`FOR x in [] RETURN x`)
    }
    const targetSide = inverse ? 'from' : 'to'
    const parentSide = inverse ? 'to' : 'from'

    const aqlTargetIds = targetIds ? `[ ${targetIds.map(_ => `${_}._id`).join(',')} ]` : `null`

    const q = aq<PageItem<{ edge: AqlGraphEdge; node: AqlGraphNode }>>(`
      let parentNode = ${fromNode}
      let targetIds = ${aqlTargetIds}

      FOR edge IN ${edgeType}
        FILTER edge._${targetSide}Type == ${aqlstr(targetNodeType)}
          && edge._${parentSide} == parentNode._id
          && ( targetIds ? edge._${targetSide} IN targetIds : true )
          ${additionalFilter ? `&& ${additionalFilter}` : ''}
          
          
          LET targetNode = Document(edge._${targetSide})
          FILTER !!targetNode 
          ${pageFilterSortLimit}

        RETURN  [
          cursor,
          {
            edge,
            node: targetNode
          }
        ]
      `)
    // targetIds && console.log('*******traversePaginateMapQuery*************', targetIds, aqlTargetIds)
    return q
  }

export const nodeRelationCountQ = ({
  edgeType,
  parentNode,
  inverse,
  targetNodeType /* , env */,
}: {
  parentNode: BV<GraphNode | null>
  edgeType: GraphEdgeType
  targetNodeType: GraphNodeType
  inverse: Boolean
}) => {
  const targetSide = inverse ? 'from' : 'to'
  const parentSide = inverse ? 'to' : 'from'
  return _<number>(`(    
    FOR edge IN ${edgeType}
      FILTER edge._${targetSide}Type == ${aqlstr(targetNodeType)}
        && edge._${parentSide} == ${parentNode}._id

        // LET targetNode = Document(edge._${targetSide})

        // FILTER !!targetNode 
        

      COLLECT WITH COUNT INTO count
    RETURN count
  )[0]`)
}
