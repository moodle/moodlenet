import * as GQL from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Id /*, parseNodeId */ } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { Maybe } from 'graphql/jsutils/Maybe'
import { aqlstr } from '../../../../lib/helpers/arango'
// import { getNodeOpAqlAssertions } from './assertions/node'
import { cursorPaginatedQuery, isMarkDeleted, toDocumentEdgeOrNode } from './helpers'

export const traverseEdges = ({
  edgeType,
  page,
  parentNodeId,
  targetNodeType,
  inverse,
  targetNodeIds,
}: {
  parentNodeId: Id
  edgeType: GQL.EdgeType
  targetNodeType: GQL.NodeType
  inverse: boolean
  page: Maybe<GQL.PaginationInput>
  targetNodeIds: Maybe<Id[]>
}) => {
  const targetSide = inverse ? 'from' : 'to'
  const parentSide = inverse ? 'to' : 'from'

  const targetIdsFilter =
    targetNodeIds && targetNodeIds.length ? `&& edge._${targetSide} IN [${targetNodeIds.map(aqlstr).join(',')}]` : ''

  const queryMapper = traversePaginateMapQuery({
    edgeType,
    parentNodeId,
    parentSide,
    targetIdsFilter,
    targetNodeType,
    targetSide,
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
    parentNodeId,
    parentSide,
    targetIdsFilter,
    targetNodeType,
    targetSide,
  }: {
    edgeType: string
    targetSide: string
    targetNodeType: string
    parentSide: string
    parentNodeId: string
    targetIdsFilter: string
    // edgeAndNodeAssertionFilters: string
  }) =>
  (pageFilterSortLimit: string) =>
    `
FOR edge IN ${edgeType}
  FILTER !${isMarkDeleted('edge')}
    && edge._${targetSide}Type == ${aqlstr(targetNodeType)}
    && edge._${parentSide} == ${aqlstr(parentNodeId)}
    ${targetIdsFilter}

  LET targetNode=Document(edge._${targetSide})
  //FILTER $ {edgeAndNodeAssertionFilters}


${pageFilterSortLimit}

RETURN  {
  cursor,
  edge:${toDocumentEdgeOrNode('edge')},
  node: ${toDocumentEdgeOrNode('targetNode')}
}
`
