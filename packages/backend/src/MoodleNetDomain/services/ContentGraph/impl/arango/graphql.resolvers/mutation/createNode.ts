import { call } from '../../../../../../../lib/domain/amqp/call'
import { CreateNodeMutationSuccess, MutationResolvers } from '../../../../ContentGraph.graphql.gen'
import { validateCreateNodeInput } from '../../../../graphql/inputStaticValidation/createNode'
import { MoodleNetArangoContentGraphSubDomain } from '../../MoodleNetArangoContentGraphSubDomain'
import { createNodeMutationError, fakeUnshallowNodeForResolverReturnType } from '../helpers'
export const createNode: MutationResolvers['createNode'] = async (_root, { input }, ctx, _info) => {
  const { nodeType } = input
  if (ctx.type === 'anon') {
    return createNodeMutationError('NotAuthorized')
  }

  const nodeInput = validateCreateNodeInput(input)
  if (nodeInput instanceof Error) {
    return createNodeMutationError('UnexpectedInput', nodeInput.message)
  }

  const shallowNodeOrError = await call<MoodleNetArangoContentGraphSubDomain>()('ContentGraph.Node.Create', ctx.flow)({
    ctx,
    data: nodeInput,
    nodeType,
  })

  if (typeof shallowNodeOrError === 'string') {
    return createNodeMutationError(shallowNodeOrError, '')
  }
  const successResult: CreateNodeMutationSuccess = {
    __typename: 'CreateNodeMutationSuccess',
    node: fakeUnshallowNodeForResolverReturnType(shallowNodeOrError),
  }

  return successResult
}
