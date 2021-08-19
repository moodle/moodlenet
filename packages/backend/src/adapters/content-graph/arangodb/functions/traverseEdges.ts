import { GraphEdgeType } from '@moodlenet/common/lib/content-graph/types/edge'
import { GraphNodeIdentifier, GraphNodeType } from '@moodlenet/common/lib/content-graph/types/node'
import { PageItem } from '@moodlenet/common/lib/content-graph/types/page'
import { Maybe } from '@moodlenet/common/lib/utils/types'
import { aq, aqlstr } from '../../../../lib/helpers/arango/query'
import { NodeRelationCountInput, TraverseFromNodeInput } from '../../../../ports/content-graph/traverseNodeRel'
import { AqlGraphEdge, AqlGraphNode } from '../types'
// import { getNodeOpAqlAssertions } from './assertions/node'
import { cursorPaginatedQuery, getAqlNodeByGraphNodeIdentifier } from './helpers'

export const traverseEdgesQ = ({
  edgeType,
  page,
  targetNodeType,
  inverse,
  /* env, */
  fromNode,
  targetIds,
}: TraverseFromNodeInput) => {
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
    fromNode: GraphNodeIdentifier
    additionalFilter?: string
    targetIds: Maybe<GraphNodeIdentifier[]>
    // edgeAndNodeAssertionFilters: string
  }) =>
  (pageFilterSortLimit: string) => {
    // console.log('********************', { targetIds })
    if (targetIds && !targetIds.length) {
      return aq<PageItem<{ edge: AqlGraphEdge; node: AqlGraphNode }>>(`FOR x in [] RETURN x`)
    }
    const targetSide = inverse ? 'from' : 'to'
    const parentSide = inverse ? 'to' : 'from'
    const q = aq<PageItem<{ edge: AqlGraphEdge; node: AqlGraphNode }>>(`
      let parentNode = ${getAqlNodeByGraphNodeIdentifier(fromNode)}
      let targets = ${!!targetIds}
        ? [ ${
          targetIds
            ? targetIds
                .map(getAqlNodeByGraphNodeIdentifier)
                .map(_ => `${_}._id`)
                .join(',')
            : null
        } ]
        : null

      FOR edge IN ${edgeType}
        FILTER edge._${targetSide}Type == ${aqlstr(targetNodeType)}
          && edge._${parentSide} == parentNode._id
          && ( targets ? edge._${targetSide} IN targets : true )
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
    // targetIds && console.log('*******traversePaginateMapQuery*************', targetIds /* , q */)
    return q
  }

export const nodeRelationCountQ = ({
  edgeType,
  fromNode,
  inverse,
  targetNodeType /* , env */,
}: NodeRelationCountInput) => {
  const targetSide = inverse ? 'from' : 'to'
  const parentSide = inverse ? 'to' : 'from'
  return aq<number>(`
    let parentNode = ${getAqlNodeByGraphNodeIdentifier(fromNode)}
    
    FOR edge IN ${edgeType}
      FILTER edge._${targetSide}Type == ${aqlstr(targetNodeType)}
        && edge._${parentSide} == parentNode._id
      COLLECT WITH COUNT INTO count
    RETURN count
`)
}
