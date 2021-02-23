import { aqlstr } from '../../../../../../../lib/helpers/arango'
import { RelPage } from '../../../../ContentGraph.graphql.gen'
import { getGlyphBasicAccessFilter } from '../../../../graphDefinition/helpers'
import { ContentGraphPersistence, Types } from '../../../types'
import { basicArangoAccessFilterEngine } from '../ContentGraph.persistence.arango.helpers'
import { aqlMergeTypenameById, paginatedQuery } from './helpers'

export const traverseEdges: ContentGraphPersistence['traverseEdges'] = async ({
  ctx,
  edgeType,
  page,
  parentNodeId,
  parentNodeType,
  inverse,
  targetNodeType,
  edgePolicy,
  targetNodePolicy,
}): Promise<Types.RelPage> => {
  const queryDepth = [1, 1]

  const fromNodeType = inverse ? targetNodeType : parentNodeType
  const toNodeType = inverse ? parentNodeType : targetNodeType

  const depth = queryDepth.join('..')
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

  return paginatedQuery<RelPage>({
    pageTypename: 'RelPage',
    pageEdgeTypename: 'RelPageEdge',
    cursorProp: `edge._key`,
    page,
    mapQuery: page => `
    FOR parentNode, edge 
      IN ${depth} ${direction} ${aqlstr(parentNodeId)} ${edgeType}

      FILTER edge.from == '${fromNodeType}' 
          && edge.to   == '${toNodeType}'
          && ${targetEdgeAccessFilter}
      
      LET node = DOCUMENT(edge.${inverse ? '_from' : '_to'})            
      FILTER ${targetNodeAccessFilter}

      ${page}

      RETURN  {
        cursor,
        edge,
        node: ${aqlMergeTypenameById('node')}
      }
    `,
  })
}
