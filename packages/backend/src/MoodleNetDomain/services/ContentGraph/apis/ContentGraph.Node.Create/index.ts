import { Id, IdKey } from '@moodlenet/common/lib/utils/content-graph'
import { MoodleNetExecutionContext } from '../../../../types'
import { CreateNodeInput, CreateNodeMutationErrorType, NodeType } from '../../ContentGraph.graphql.gen'
import { CreateNodeShallowPayload, ShallowNode } from '../../persistence/types'
import { createCreatedEdge, getCreateHook } from './hooks'

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
  if (!(ctx.auth || ctx.system)) {
    return {
      __typename: 'CreateNodeMutationError',
      details: `anonymous can't create nodes`,
      type: CreateNodeMutationErrorType.NotAuthorized,
    }
  }
  const createNodeResult = await hook({ input, ctx, key })
  if (ctx.auth && createNodeResult.__typename !== 'CreateNodeMutationError') {
    const shallowNode = createNodeResult as ShallowNode //ByType<Type>
    return createCreatedEdge({
      ctx,
      nodeId: shallowNode._id as Id,
      nodeType,
      userId: ctx.auth.userId,
    }).then(edgeRes => {
      if (edgeRes.__typename === 'CreateEdgeMutationError') {
        console.error(edgeRes)
        // TODO: manage weird err
      }
      return createNodeResult
    })
  } else {
    return createNodeResult
  }
}
