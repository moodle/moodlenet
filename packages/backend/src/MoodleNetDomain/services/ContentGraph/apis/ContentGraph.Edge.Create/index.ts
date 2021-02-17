import { Id, IdKey } from '@moodlenet/common/lib/utils/content-graph'
import { MoodleNetExecutionContext } from '../../../../types'
import { CreateEdgeInput, CreateEdgeMutationErrorType, EdgeType } from '../../ContentGraph.graphql.gen'
import { createEdgeMutationError } from '../../graphql.resolvers/helpers'
import { createHooks, isAllowedCreationType } from './hooks'

export type CreateEdgeReq<Type extends EdgeType> = {
  edgeType: Type
  input: Exclude<CreateEdgeInput[Type], null>
  ctx: MoodleNetExecutionContext
  key: IdKey
  from: Id
  to: Id
}

export const CreateEdgeHandler = async <Type extends EdgeType>({
  ctx,
  input,
  edgeType,
  from,
  to,
  key,
}: CreateEdgeReq<Type>) => {
  console.log('CreateEdgeHandler', edgeType)
  if (!isAllowedCreationType(edgeType)) {
    return createEdgeMutationError(CreateEdgeMutationErrorType.NotAuthorized, 'not Allowed Creation Type')
  }
  const hook = createHooks[edgeType]
  return await hook({ input, ctx, from, to, key })
}
