import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { Maybe } from 'graphql/jsutils/Maybe'
import { aqlstr } from '../../../../../../lib/helpers/arango'
import { MoodleNetExecutionContext } from '../../../../../types'
import * as GQL from '../../../ContentGraph.graphql.gen'
// import { basicArangoAccessFilterEngine } from '../ContentGraph.persistence.arango.helpers'
import { cursorPaginatedQuery } from './helpers'

export const traverseEdges = async ({
  /* ctx, */
  edgeType,
  page,
  parentNodeId,
  inverse,
  // edgePolicy,
  // targetNodePolicy,
  //sort,
  targetNodeType,
}: {
  parentNodeId: Id
  edgeType: GQL.EdgeType
  targetNodeType: GQL.NodeType
  // edgePolicy: BasicAccessPolicy
  // targetNodePolicy: BasicAccessPolicy
  inverse: boolean
  page: Maybe<GQL.PaginationInput>
  ctx: MoodleNetExecutionContext
  sort: Maybe<GQL.NodeRelSort[]>
}): Promise<GQL.RelPage> => {
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

  return cursorPaginatedQuery<GQL.RelPage>({
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
