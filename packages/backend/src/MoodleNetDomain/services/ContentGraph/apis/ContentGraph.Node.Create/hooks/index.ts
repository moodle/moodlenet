import { EdgeType, Id, IdKey } from '@moodlenet/common/lib/utils/content-graph'
import { ulidKey } from '../../../../../../lib/helpers/arango'
import { MoodleNetExecutionContext } from '../../../../../types'
import { getContentGraphPersistence } from '../../../ContentGraph.env'
import { CreateNodeInput, NodeType } from '../../../ContentGraph.graphql.gen'
import { CreateNodeShallowPayload } from '../../../persistence/types'

type Just<T> = Exclude<T, null | undefined>

export type CreateHook<T extends NodeType> = (_: {
  input: Just<CreateNodeInput[T]>
  ctx: MoodleNetExecutionContext
  key?: IdKey
}) => Promise<CreateNodeShallowPayload<T>>

const persistence = getContentGraphPersistence()

export const getCreateHook = <T extends NodeType>(type: T): CreateHook<T> => (createHooks[type] as any) as CreateHook<T>
export const createHooks: {
  [T in NodeType]: CreateHook<T>
} = {
  User: async ({ input, ctx, key }) => {
    const { createNode } = await persistence
    const createResult = await createNode<NodeType.User>({
      ctx,
      key,
      nodeType: NodeType.User,
      data: {
        name: input.name,
        icon: input.icon,
        summary: input.summary,
      },
    })
    return createResult
  },
  Subject: async ({ input, ctx, key }) => {
    const { createNode } = await persistence
    const createResult = await createNode<NodeType.Subject>({
      ctx,
      key,
      nodeType: NodeType.Subject,
      data: {
        name: input.name,
        icon: input.icon,
        summary: input.summary,
      },
    })
    return createResult
  },
  Collection: async ({ input, ctx, key }) => {
    const { createNode } = await persistence
    const createResult = await createNode<NodeType.Collection>({
      ctx,
      key,
      nodeType: NodeType.Collection,
      data: {
        name: input.name,
        icon: input.icon,
        summary: input.summary,
      },
    })
    return createResult
  },
  Resource: async ({ input, ctx, key }) => {
    const { createNode } = await persistence
    const createResult = await createNode<NodeType.Resource>({
      ctx,
      key,
      nodeType: NodeType.Resource,
      data: {
        name: input.name,
        icon: input.icon,
        summary: input.summary,
      },
    })
    return createResult
  },
}
export const createCreatedEdge = async ({
  nodeId,
  userId,
  ctx,
}: {
  nodeId: Id
  nodeType: NodeType
  userId: Id
  ctx: MoodleNetExecutionContext
}) => {
  const { createEdge } = await persistence
  const key = ulidKey()
  return createEdge<EdgeType.Created>({ ctx, data: {}, edgeType: EdgeType.Created, from: userId, key, to: nodeId })
}
