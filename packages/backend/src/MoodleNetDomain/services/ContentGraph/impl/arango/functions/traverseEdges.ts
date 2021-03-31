import { Id, parseNodeId } from '@moodlenet/common/lib/utils/content-graph'
import { Maybe } from 'graphql/jsutils/Maybe'
import { aqlstr } from '../../../../../../lib/helpers/arango'
import { MoodleNetExecutionContext } from '../../../../../types'
import * as GQL from '../../../ContentGraph.graphql.gen'
import { Persistence } from '../types'
import { getEdgeOpAqlAssertions } from './assertions/edge'
import { getNodeOpAqlAssertions } from './assertions/node'
import { cursorPaginatedQuery, isMarkDeleted } from './helpers'

export const traverseEdges = async ({
  persistence,
  edgeType,
  page,
  parentNodeId,
  targetNodeType,
  inverse,
  targetNodeIds,
  ctx,
}: {
  persistence: Persistence
  parentNodeId: Id
  edgeType: GQL.EdgeType
  targetNodeType: GQL.NodeType
  inverse: boolean
  page: Maybe<GQL.PaginationInput>
  targetNodeIds: Maybe<Id[]>
  ctx: MoodleNetExecutionContext
}): Promise<GQL.RelPage> => {
  const { nodeType: parentNodeType } = parseNodeId(parentNodeId)
  const targetSide = inverse ? 'from' : 'to'
  const parentSide = inverse ? 'to' : 'from'

  const aqlTargetNodeAssertionMaps = getNodeOpAqlAssertions({
    ctx,
    op: 'read',
    nodeType: targetNodeType,
    nodeVar: 'targetNode',
  })
  if (typeof aqlTargetNodeAssertionMaps === 'string') {
    throw new Error(`aqlTargetNodeAssertionMaps->${aqlTargetNodeAssertionMaps}`)
  }
  const fromType = inverse ? targetNodeType : parentNodeType
  const toType = !inverse ? targetNodeType : parentNodeType
  const aqlEdgeAssertionMaps = getEdgeOpAqlAssertions({
    ctx,
    edgeType,
    edgeVar: 'edge',
    op: 'traverse',
    fromType,
    toType,
  })
  if (typeof aqlEdgeAssertionMaps === 'string') {
    //TODO : decide if keep throwing or return empty page ?
    throw new Error(`aqlEdgeAssertionMaps->${aqlEdgeAssertionMaps}`)
  }

  const edgeAndNodeAssertionFilters = `( ${aqlEdgeAssertionMaps.renderedAqlFilterExpr} AND ${aqlTargetNodeAssertionMaps.renderedAqlFilterExpr} )`

  const targetIdsFilter =
    targetNodeIds && targetNodeIds.length ? `&& edge._${targetSide} IN [${targetNodeIds.map(aqlstr).join(',')}]` : ''

  return cursorPaginatedQuery<GQL.RelPage>({
    persistence,
    pageTypename: 'RelPage',
    pageEdgeTypename: 'RelPageEdge',
    cursorProp: `edge._key`,
    page,
    mapQuery: pageFilterSortLimit => `
      FOR edge IN ${edgeType}
        FILTER !${isMarkDeleted('edge')}
          && edge._${targetSide}Type == ${aqlstr(targetNodeType)}
          && edge._${parentSide} == ${aqlstr(parentNodeId)}
          ${targetIdsFilter}

        LET targetNode=Document(edge._${targetSide})
        FILTER ${edgeAndNodeAssertionFilters}
      

      ${pageFilterSortLimit}

      RETURN  {
        cursor,
        edge,
        node: targetNode
      }
    `,
  })
}
