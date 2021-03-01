import { aqlstr } from '../../../../../../../lib/helpers/arango'
import { RelPage } from '../../../../ContentGraph.graphql.gen'
import { getGlyphBasicAccessFilter } from '../../../../graphDefinition/helpers'
import { ContentGraphPersistence, Types } from '../../../types'
import { basicArangoAccessFilterEngine } from '../ContentGraph.persistence.arango.helpers'
import { aqlMergeTypenameById, cursorPaginatedQuery } from './helpers'

export const traverseEdges: ContentGraphPersistence['traverseEdges'] = async ({
  ctx,
  edgeType,
  page,
  parentNodeId,
  inverse,
  targetNodeType,
  edgePolicy,
  targetNodePolicy,
}): Promise<Types.RelPage> => {
  const filterOnSideType = inverse ? 'from' : 'to'

  const direction = inverse ? 'INBOUND' : 'OUTBOUND'

  const targetEdgeAccessFilter = getGlyphBasicAccessFilter({
    ctx,
    glyphTag: 'edge',
    policy: edgePolicy,
    engine: basicArangoAccessFilterEngine,
  })

  const targetNodeAccessFilter = getGlyphBasicAccessFilter({
    ctx,
    glyphTag: 'node',
    policy: targetNodePolicy,
    engine: basicArangoAccessFilterEngine,
  })

  return cursorPaginatedQuery<RelPage>({
    pageTypename: 'RelPage',
    pageEdgeTypename: 'RelPageEdge',
    cursorProp: `edge._key`,
    page,
    mapQuery: pageFilterSort => `
    FOR targetNode, edge 
      IN 1..1 ${direction} ${aqlstr(parentNodeId)} ${edgeType}

      FILTER edge.${filterOnSideType} == '${targetNodeType}' 
          && ${targetEdgeAccessFilter}
      
      FILTER ${targetNodeAccessFilter}

      ${pageFilterSort}

      RETURN  {
        cursor,
        edge,
        node: ${aqlMergeTypenameById('targetNode')}
      }
    `,
  })
}
