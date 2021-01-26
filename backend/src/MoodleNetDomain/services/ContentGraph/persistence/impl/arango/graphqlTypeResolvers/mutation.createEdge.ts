import { CreateEdgeMutationErrorType } from '../../../../ContentGraph.graphql.gen'
import { Types } from '../../../types'
import {
  bindString,
  cantBindMessage,
  edgeDataMustBePresentMessage,
  getBindingGraph,
} from '../ContentGraph.persistence.arango.helpers'
export const createEdge: Types.Resolvers['Mutation']['createEdge'] = async (
  _root,
  { edge, edgeType, from, to },
  ctx /* ,
  _info */
) => {
  const graph = await getBindingGraph({ edgeType, from, to })
  if (!graph) {
    return {
      __typename: 'CreateEdgeMutationError',
      type: CreateEdgeMutationErrorType.NotAllowed,
      details: cantBindMessage({ edgeType, from, to }),
    }
  }
  const data = edge[edgeType]
  if (!data) {
    return {
      __typename: 'CreateEdgeMutationError',
      type: CreateEdgeMutationErrorType.UnexpectedInput,
      details: edgeDataMustBePresentMessage(edgeType),
    }
  }

  //FIXME: all acceess checks !
  //FIXME: all data validation checks !

  const result = await graph.edgeCollection(edgeType).save(
    {
      ...data,
      _from: from,
      _to: to,
    },
    { returnNew: true }
  )

  return result.new
}
