import { api } from '../../../../../lib/domain'
import { MoodleNetDomain } from '../../../../MoodleNetDomain'
import {
  CreateNodeMutationErrorType,
  CreateNodeMutationSuccess,
  MutationResolvers,
} from '../../ContentGraph.graphql.gen'
// import { getStaticFilteredNodeBasicAccessPolicy } from '../../graphDefinition/helpers'
import { createNodeMutationError, fakeUnshallowNodeForResolverReturnType } from '../helpers'
import { validateCreateNodeInput } from '../inputStaticValidation/createNode'
export const createNode: MutationResolvers['createNode'] = async (_root, { input }, ctx, _info) => {
  const { nodeType } = input
  if (ctx.type === 'anon') {
    // probably not allowed (may want to split in policy lookup in 2 steps, to check if found and then if auth applies )
    return createNodeMutationError(CreateNodeMutationErrorType.NotAuthorized)
  }

  // const policy = getStaticFilteredNodeBasicAccessPolicy({
  //   accessType: 'create',
  //   nodeType,
  //   ctx,
  // })
  // if (!policy) {
  //   // probably not allowed (may want to split in policy lookup in 2 steps, to check if found and then if auth applies )
  //   return createNodeMutationError(CreateNodeMutationErrorType.NotAuthorized)
  // }

  const nodeInput = validateCreateNodeInput(input)
  if (nodeInput instanceof Error) {
    return createNodeMutationError(CreateNodeMutationErrorType.UnexpectedInput, nodeInput.message)
  }
  const shallowNodeOrError = await api<MoodleNetDomain>(ctx.flow)('ContentGraph.Node.Create').call(createNode =>
    createNode({ ctx, input: nodeInput, nodeType }),
  )

  if (shallowNodeOrError.__typename === 'CreateNodeMutationError') {
    return shallowNodeOrError
  }
  const successResult: CreateNodeMutationSuccess = {
    __typename: 'CreateNodeMutationSuccess',
    node: fakeUnshallowNodeForResolverReturnType(shallowNodeOrError),
  }

  return successResult
}
