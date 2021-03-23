import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { Maybe } from 'graphql/jsutils/Maybe'
import { aqlstr } from '../../../../../../lib/helpers/arango'
import * as GQL from '../../../ContentGraph.graphql.gen'
import { Persistence } from '../types'
import { cursorPaginatedQuery } from './helpers'

export const traverseEdges = async ({
  persistence,
  edgeType,
  page,
  parentNodeId,
  targetNodeType,
  inverse,
  targetNodeIds,
}: {
  persistence: Persistence
  parentNodeId: Id
  edgeType: GQL.EdgeType
  targetNodeType: GQL.NodeType
  inverse: boolean
  page: Maybe<GQL.PaginationInput>
  targetNodeIds: Maybe<Id[]>
}): Promise<GQL.RelPage> => {
  const targetSide = inverse ? 'from' : 'to'
  const parentSide = inverse ? 'to' : 'from'

  // TODO: auth&policies !

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
        FILTER edge._${targetSide}Type == ${aqlstr(targetNodeType)}
          && edge._${parentSide} == ${aqlstr(parentNodeId)}
          ${targetIdsFilter}

        LET targetNode=Document(edge._${targetSide})
        // FILTER $_{targetNodeAccessFilter}
      

      ${pageFilterSortLimit}

      RETURN  {
        cursor,
        edge,
        node: targetNode
      }
    `,
  })
}
