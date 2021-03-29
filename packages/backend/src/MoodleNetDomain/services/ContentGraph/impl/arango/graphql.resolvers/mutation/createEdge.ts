import { call } from '../../../../../../../lib/domain/amqp/call'
import { CreateEdgeMutationSuccess, MutationResolvers } from '../../../../ContentGraph.graphql.gen'
import { cantBindMessage } from '../../../../graphDefinition/strings'
import { validateCreateEdgeInput } from '../../../../graphql/inputStaticValidation/createEdge'
import { MoodleNetArangoContentGraphSubDomain } from '../../MoodleNetArangoContentGraphSubDomain'
import { createEdgeMutationError, fakeUnshallowEdgeForResolverReturnType } from '../helpers'
export const createEdge: MutationResolvers['createEdge'] = async (_root, { input }, ctx /*,  _info */) => {
  // console.log('createEdge', input)
  const { edgeType, from, to } = input
  if (ctx.type === 'anon') {
    return createEdgeMutationError('NotAuthorized', `Anonymous can't create`)
  }
  const edgeInput = validateCreateEdgeInput(input)
  if (edgeInput instanceof Error) {
    return createEdgeMutationError('UnexpectedInput', edgeInput.message)
  }
  const shallowEdgeOrError = await call<MoodleNetArangoContentGraphSubDomain>()('ContentGraph.Edge.Create', ctx.flow)({
    ctx,
    data: edgeInput,
    edgeType,
    from,
    to,
  })

  if (typeof shallowEdgeOrError === 'string') {
    return createEdgeMutationError(shallowEdgeOrError, cantBindMessage({ edgeType, from, to }))
  }
  const successResult: CreateEdgeMutationSuccess = {
    __typename: 'CreateEdgeMutationSuccess',
    edge: fakeUnshallowEdgeForResolverReturnType(shallowEdgeOrError),
  }

  return successResult
}
