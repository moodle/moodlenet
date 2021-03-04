import { IdKey } from '@moodlenet/common/lib/utils/content-graph'
import { event } from '../../../../../lib/domain'
import { mergeFlow } from '../../../../../lib/domain/helpers'
import { MoodleNetDomain } from '../../../../MoodleNetDomain'
import { MoodleNetExecutionContext } from '../../../../types'
import { CreateNodeInput, /* CreateNodeMutationErrorType, */ NodeType } from '../../ContentGraph.graphql.gen'
import { CreateNodeShallowPayload } from '../../persistence/types'
import { getCreateHook } from './hooks'

export type CreateNodeReq<Type extends NodeType> = {
  nodeType: Type
  input: Exclude<CreateNodeInput[Type], null | undefined>
  key?: IdKey
  ctx: MoodleNetExecutionContext
}

export const CreateNodeHandler = async <Type extends NodeType>({
  ctx,
  input,
  nodeType,
  key,
}: CreateNodeReq<Type>): Promise<CreateNodeShallowPayload<Type>> => {
  const hook = getCreateHook<Type>(nodeType)
  // if (!(ctx.type === 'anon')) {
  //   return {
  //     __typename: 'CreateNodeMutationError',
  //     details: `anonymous can't create nodes`,
  //     type: CreateNodeMutationErrorType.NotAuthorized,
  //   }
  // }
  const createNodeResult = await hook({ input, ctx, key })
  if (createNodeResult.__typename !== 'CreateNodeMutationError') {
    event<MoodleNetDomain>(mergeFlow(ctx.flow, [nodeType]))(`ContentGraph.Node.Created`).emit({
      payload: { node: createNodeResult },
    })
  }

  return createNodeResult
}
