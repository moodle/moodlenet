import { CreateEdgeMutationErrorType } from '../../../../ContentGraph.graphql.gen'
import { getConnectionDef } from '../../../../graphDefinition'
import {
  cantBindMessage,
  edgeDataMustBePresentMessage,
} from '../../../../graphDefinition/strings'
import { Types } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'
export const createEdge: Types.Resolvers['Mutation']['createEdge'] = async (
  _root,
  { edge, edgeType, from, to },
  ctx /* ,
  _info */
) => {
  const { graph } = await DBReady
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
