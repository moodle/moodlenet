import { call } from '../../../../../../../lib/domain/amqp/call'
import { DeleteEdgeMutationSuccess, MutationResolvers } from '../../../../ContentGraph.graphql.gen'
import { MoodleNetArangoContentGraphSubDomain } from '../../MoodleNetArangoContentGraphSubDomain'
import { deleteEdgeMutationError } from '../helpers'
export const deleteEdge: MutationResolvers['deleteEdge'] = async (_root, { input }, ctx /*,  _info */) => {
  // console.log('deleteEdge', input)
  const { edgeType, id } = input
  if (ctx.type === 'anon') {
    return deleteEdgeMutationError('NotAuthorized', `Anonymous can't delete`)
  }

  const deleteResult = await call<MoodleNetArangoContentGraphSubDomain>()('ContentGraph.Edge.Delete', ctx.flow)({
    ctx,
    edgeType,
    edgeId: id,
  })

  if (typeof deleteResult === 'string') {
    return deleteEdgeMutationError(deleteResult, null)
  }
  const successResult: DeleteEdgeMutationSuccess = {
    __typename: 'DeleteEdgeMutationSuccess',
    edgeId: id,
  }

  return successResult
}
