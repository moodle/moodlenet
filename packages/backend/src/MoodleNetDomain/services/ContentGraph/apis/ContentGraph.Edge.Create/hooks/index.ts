import { Id, IdKey } from '@moodlenet/common/lib/utils/content-graph'
import { MoodleNetExecutionContext } from '../../../../../types'
import { getContentGraphPersistence } from '../../../ContentGraph.env'
import { CreateEdgeInput, EdgeType } from '../../../ContentGraph.graphql.gen'
import { CreateEdgeShallowPayload } from '../../../persistence/types'

type Just<T> = Exclude<T, null | undefined>

export type CreateHook<T extends EdgeType> = (_: {
  input: Just<CreateEdgeInput[T]>
  from: Id
  to: Id
  key?: IdKey
  ctx: MoodleNetExecutionContext
}) => Promise<CreateEdgeShallowPayload<T>>

const persistence = getContentGraphPersistence()

export const getCreateHook = <T extends EdgeType>(type: T): CreateHook<T> => (createHooks[type] as any) as CreateHook<T>

export const createHooks: {
  [T in EdgeType]: CreateHook<T>
} = {
  Follows: async ({ ctx, from, to, key }) => {
    const { createEdge } = await persistence
    const createResult = await createEdge<EdgeType.Follows>({
      ctx,
      key,
      edgeType: EdgeType.Follows,
      from,
      to,
      data: {},
    })
    return createResult
  },
  AppliesTo: async ({ ctx, from, to, key }) => {
    const { createEdge } = await persistence
    const createResult = await createEdge<EdgeType.AppliesTo>({
      ctx,
      key,
      edgeType: EdgeType.AppliesTo,
      from,
      to,
      data: {},
    })
    return createResult
  },
  Contains: async ({ ctx, from, to, key }) => {
    const { createEdge } = await persistence
    const createResult = await createEdge<EdgeType.Contains>({
      ctx,
      key,
      edgeType: EdgeType.Contains,
      from,
      to,
      data: {},
    })
    return createResult
  },
  Created: async ({ ctx, from, to, key }) => {
    const { createEdge } = await persistence
    const createResult = await createEdge<EdgeType.Created>({
      ctx,
      key,
      edgeType: EdgeType.Created,
      from,
      to,
      data: {},
    })
    return createResult
  },
  Likes: async ({ ctx, from, to, key }) => {
    const { createEdge } = await persistence
    const createResult = await createEdge<EdgeType.Likes>({
      ctx,
      key,
      edgeType: EdgeType.Likes,
      from,
      to,
      data: {},
    })
    return createResult
  },
}
