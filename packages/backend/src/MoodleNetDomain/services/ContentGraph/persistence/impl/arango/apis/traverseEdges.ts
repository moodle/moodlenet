import { aqlstr } from '../../../../../../../lib/helpers/arango'
import { RelPage } from '../../../../ContentGraph.graphql.gen'
// import { getGlyphBasicAccessFilter } from '../../../../graphDefinition/helpers'
import { ContentGraphPersistence, Types } from '../../../types'
// import { basicArangoAccessFilterEngine } from '../ContentGraph.persistence.arango.helpers'
import { cursorPaginatedQuery } from './helpers'

export const traverseEdges: ContentGraphPersistence['traverseEdges'] = async ({
  /* ctx, */
  edgeType,
  page,
  parentNodeId,
  inverse,
  targetNodeType,
  // edgePolicy,
  // targetNodePolicy,
  sort: _sort,
}): Promise<Types.RelPage> => {
  const targetSide = inverse ? 'from' : 'to'
  const parentSide = inverse ? 'to' : 'from'

  // TODO: define and implement sorting

  // const targetEdgeAccessFilter = getGlyphBasicAccessFilter({
  //   ctx,
  //   glyphTag: 'edge',
  //   policy: edgePolicy,
  //   engine: basicArangoAccessFilterEngine,
  // })

  // const targetNodeAccessFilter = getGlyphBasicAccessFilter({
  //   ctx,
  //   glyphTag: 'node',
  //   policy: targetNodePolicy,
  //   engine: basicArangoAccessFilterEngine,
  // })

  return cursorPaginatedQuery<RelPage>({
    pageTypename: 'RelPage',
    pageEdgeTypename: 'RelPageEdge',
    cursorProp: `edge._key`,
    page,
    mapQuery: pageFilterSortLimit => `
      FOR edge IN ${edgeType}
        FILTER edge._${targetSide}Type == '${targetNodeType}' 
          && edge._${parentSide} == ${aqlstr(parentNodeId)}
          // && $_{targetEdgeAccessFilter}

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
