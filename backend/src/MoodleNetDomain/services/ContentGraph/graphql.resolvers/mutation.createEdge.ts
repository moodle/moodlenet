import {
  CreateEdgeMutationErrorType,
  Resolvers,
} from '../ContentGraph.graphql.gen'
import { getConnectionDef } from '../graphDefinition'
import {
  cantBindMessage,
  edgeDataMustBePresentMessage,
} from '../graphDefinition/strings'
export const createEdge: Resolvers['Mutation']['createEdge'] = async (
  _root,
  { edge, edgeType, from, to },
  ctx /* ,
  _info */
) => {
  const connection = getConnectionDef({ edge: edgeType, from, to })
  if (!connection) {
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
}
