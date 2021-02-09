import { api } from '../../../../../lib/domain'
import { MoodleNetDomain } from '../../../../MoodleNetDomain'
import { CreateEdgeMutationErrorType, CreateEdgeMutationSuccess, Resolvers } from '../../ContentGraph.graphql.gen'
import { getConnectionDef } from '../../graphDefinition'
import { getStaticFilteredEdgeBasicAccessPolicy, isId, nodeTypeFromId } from '../../graphDefinition/helpers'
import { cantBindMessage } from '../../graphDefinition/strings'
import { createEdgeMutationError, fakeUnshallowEdgeForResolverReturnType } from '../helpers'
import { validateCreateEdgeInput } from '../inputStaticValidation/createEdge'
export const createEdge: Resolvers['Mutation']['createEdge'] = async (_root, { input }, ctx /* ,
  _info */) => {
  console.log('createEdge', input)
  const { edgeType, from, to } = input
  if (!ctx.auth) {
    // probably not allowed (may want to split in policy lookup in 2 steps, to check if found and then if auth applies )
    return createEdgeMutationError(CreateEdgeMutationErrorType.NotAuthorized, `Anonymous can't create`)
  }
  const fromType = nodeTypeFromId(from)
  const toType = nodeTypeFromId(to)
  if (!(isId(from) && isId(to) && fromType && toType)) {
    return createEdgeMutationError(CreateEdgeMutationErrorType.UnexpectedInput, `${from} or ${to} are not valid ids`)
  }
  const policy = getStaticFilteredEdgeBasicAccessPolicy({
    accessType: 'create',
    edgeType,
    ctx,
  })
  if (!policy) {
    // probably not allowed (may want to split in policy lookup in 2 steps, to check if found and then if auth applies )
    return createEdgeMutationError(CreateEdgeMutationErrorType.NotAuthorized, 'No Policy')
  }
  const connection = getConnectionDef({
    edge: edgeType,
    from: fromType,
    to: toType,
  })
  if (!connection) {
    return createEdgeMutationError(CreateEdgeMutationErrorType.NotAllowed, cantBindMessage({ edgeType, from, to }))
  }

  type CreatingType = typeof edgeType
  const edgeInput = validateCreateEdgeInput(input)
  if (edgeInput instanceof Error) {
    return createEdgeMutationError(CreateEdgeMutationErrorType.UnexpectedInput, edgeInput.message)
  }
  const shallowEdgeOrError = await api<MoodleNetDomain>(ctx.flow)('ContentGraph.Edge.Create').call(createEdge =>
    createEdge<CreatingType>({ ctx, input: edgeInput, edgeType, from, to }),
  )

  if (shallowEdgeOrError.__typename === 'CreateEdgeMutationError') {
    return shallowEdgeOrError
  }
  const successResult: CreateEdgeMutationSuccess = {
    __typename: 'CreateEdgeMutationSuccess',
    edge: fakeUnshallowEdgeForResolverReturnType(shallowEdgeOrError),
  }

  console.log('created edge ', successResult)

  return successResult
}
