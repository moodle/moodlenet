import { GraphEdge, GraphEdgeType } from '@moodlenet/common/dist/content-graph/types/edge'
import { GraphNode, GraphNodeType } from '@moodlenet/common/dist/content-graph/types/node'
import { PageItem } from '@moodlenet/common/dist/content-graph/types/page'
import { Maybe } from '@moodlenet/common/dist/utils/types'
import { aq, aqlstr } from '../../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../../lib/plug'
import { Assertions, BV } from '../../../../../ports/content-graph/graph-lang/base'
import { AdapterArg, Operators, operators } from '../../../../../ports/content-graph/relations/traverse'
import { _aqlBv } from '../../adapters/bl/baseOperators'
// import { getNodeOpAqlAssertions } from './assertions/node'
import {
  aqlGraphEdge2GraphEdge,
  aqlGraphNode2GraphNode,
  cursorPaginatedQuery,
  getAqlAssertions,
  graphNode2AqlId,
} from '../helpers'

export const traverseEdgesQ = ({
  edgeType,
  page,
  targetNodeTypes,
  inverse,
  fromNode,
  targetIds,
  assertions,
}: AdapterArg) => {
  // const targetIdsFilter =
  //   targetNodeIds && targetNodeIds.length ? `&& edge._${targetSide} IN [${targetNodeIds.map(aqlstr).join(',')}]` : ''

  const queryMapper = traversePaginateMapQuery({
    edgeType,
    fromNode,
    inverse,
    targetNodeTypes,
    targetIds,
    assertions,
  })

  return cursorPaginatedQuery({
    cursorProp: `traverseEdge._created`,
    page,
    inverseSort: true,
    mapQuery: queryMapper,
  })
}

export const traversePaginateMapQuery =
  ({
    edgeType,
    fromNode,
    assertions,
    targetNodeTypes,
    inverse,
    targetIds,
  }: {
    edgeType: GraphEdgeType
    targetNodeTypes: Maybe<GraphNodeType[]>
    inverse: boolean
    fromNode: BV<GraphNode>
    assertions: Assertions
    targetIds: Maybe<BV<GraphNode>[]>
  }) =>
  (pageFilterSortLimit: string) => {
    if (targetIds && !targetIds.length) {
      return aq<PageItem<{ edge: GraphEdge; node: GraphNode }>>(`FOR x in [] RETURN x`)
    }
    const aqlAssertions = getAqlAssertions(assertions)

    const targetSide = inverse ? 'from' : 'to'
    const parentSide = inverse ? 'to' : 'from'
    const targetNodeTypesFilter = targetNodeTypes
      ? `&& traverseEdge._${targetSide}Type IN ${aqlstr(targetNodeTypes)}`
      : ``

    //const aqlTargetIds = targetIds ? `[ ${targetIds.map(_ => `${_}._id`).join(',')} ]` : `null`
    const aqlTargetIds = targetIds
      ? `(FOR trgtNode IN ${`[${targetIds.join(',')}]`} RETURN ${graphNode2AqlId('trgtNode')})`
      : `null`

    const q = aq<PageItem<{ edge: GraphEdge; node: GraphNode }>>(`
      let traverseParentNode = ${fromNode}
      let targetIds = ${aqlTargetIds}

      FOR traverseEdge IN ${edgeType}
        FILTER  traverseEdge._${parentSide} == ${graphNode2AqlId('traverseParentNode')}
                ${targetNodeTypesFilter}
                && ( targetIds ? traverseEdge._${targetSide} IN targetIds : true )
          
          LET traverseNode = ${aqlGraphNode2GraphNode(`Document(traverseEdge._${targetSide})`)}
          FILTER !!traverseNode && ${aqlAssertions}
          ${pageFilterSortLimit}

        RETURN  [
          cursor,
          {
            edge: ${aqlGraphEdge2GraphEdge('traverseEdge')},
            node: ${aqlGraphNode2GraphNode('traverseNode')}
          }
        ]
      `)
    // console.log('traverseQ', q)
    return q
  }

export const arangoTraverseOperators: SockOf<typeof operators> = async () => TRAVERSE_OPERATORS
export const TRAVERSE_OPERATORS: Operators = {
  traverseNode: _aqlBv('traverseNode'),
  traverseEdge: _aqlBv('traverseEdge'),
}
