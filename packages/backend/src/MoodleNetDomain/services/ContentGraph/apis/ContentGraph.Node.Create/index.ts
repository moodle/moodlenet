import { IdKey } from '@moodlenet/common/lib/utils/content-graph'
import { MoodleNetExecutionContext } from '../../../../types'
import { CreateNodeInput, /* CreateNodeMutationErrorType, */ NodeType } from '../../ContentGraph.graphql.gen'
import { CreateNodeShallowPayload } from '../../persistence/types'
import { getCreateHook } from './hooks'

export type CreateNodeReq<Type extends NodeType> = {
  nodeType: Type
  input: Exclude<CreateNodeInput[Type], null | undefined>
  key: IdKey
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

  return createNodeResult
}
