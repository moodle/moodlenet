import { BV } from '@moodlenet/common/lib/content-graph/bl/graph-lang'
import { GraphEdge, GraphEdgeType } from '@moodlenet/common/lib/content-graph/types/edge'
import { GraphNode, GraphNodeType } from '@moodlenet/common/lib/content-graph/types/node'
import { PageItem } from '@moodlenet/common/lib/content-graph/types/page'
import { AuthId } from '@moodlenet/common/lib/types'
import { Maybe } from '@moodlenet/common/lib/utils/types'
import { aq, aqlstr } from '../../../../../lib/helpers/arango/query'
import { TraverseFromNodeAdapterInput } from '../../../../../ports/content-graph/traverseNodeRel'
import { _ } from '../../adapters/bl/_'
// import { getNodeOpAqlAssertions } from './assertions/node'
import { aqlGraphEdge2GraphEdge, aqlGraphNode2GraphNode, cursorPaginatedQuery, graphNode2AqlId } from '../helpers'

export const traverseEdgesQ = ({
  edgeType,
  page,
  targetNodeType,
  inverse,
  env,
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
    issuerAuthId: env?.user.authId,
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
    issuerAuthId,
    edgeType,
    fromNode,
    additionalFilter,
    targetNodeType,
    inverse,
    targetIds,
  }: {
    issuerAuthId: AuthId | null | undefined
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
      return aq<PageItem<{ edge: GraphEdge; node: GraphNode }>>(`FOR x in [] RETURN x`)
    }
    const targetSide = inverse ? 'from' : 'to'
    const parentSide = inverse ? 'to' : 'from'

    //const aqlTargetIds = targetIds ? `[ ${targetIds.map(_ => `${_}._id`).join(',')} ]` : `null`
    const aqlTargetIds = targetIds
      ? `(FOR trgtNode IN ${`[${targetIds.join(',')}]`} RETURN ${graphNode2AqlId('trgtNode')})`
      : `null`

    const q = aq<PageItem<{ edge: GraphEdge; node: GraphNode }>>(`
      let parentNode = ${fromNode}
      let targetIds = ${aqlTargetIds}

      FOR edge IN ${edgeType}
        FILTER edge._${targetSide}Type == ${aqlstr(targetNodeType)}
          && edge._${parentSide} == ${graphNode2AqlId('parentNode')}
          && ( targetIds ? edge._${targetSide} IN targetIds : true )
            ${additionalFilter ? `&& ${additionalFilter}` : ''}
          
          
          LET targetNode = Document(edge._${targetSide})
          FILTER !!targetNode && ( targetNode._published ${
            issuerAuthId ? `|| targetNode._creatorAuthId == ${aqlstr(issuerAuthId)}` : ''
          } )
          ${pageFilterSortLimit}

        RETURN  [
          cursor,
          {
            edge: ${aqlGraphEdge2GraphEdge('edge')},
            node: ${aqlGraphNode2GraphNode('targetNode')}
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
      let parentNode = ${parentNode}
      FOR edge IN ${edgeType}
      FILTER edge._${targetSide}Type == ${aqlstr(targetNodeType)}
        && edge._${parentSide} == ${graphNode2AqlId('parentNode')}

      COLLECT WITH COUNT INTO count
    RETURN count
  )[0]`)
}
