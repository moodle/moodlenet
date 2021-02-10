import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { MoodleNetExecutionContext } from '../../../../../types'
import { getContentGraphPersistence } from '../../../ContentGraph.env'
import { CreateEdgeInput, EdgeType } from '../../../ContentGraph.graphql.gen'
import { CreateEdgeShallowPayload } from '../../../persistence/types'

type Just<T> = Exclude<T, null | undefined>

export type CreateHook<T extends EdgeType> = (_: {
  input: Just<CreateEdgeInput[T]>
  from: Id
  to: Id
  ctx: MoodleNetExecutionContext
}) => Promise<CreateEdgeShallowPayload<T>>

type NotAllowedCreationType = never
export type AllowedCreationType = Exclude<EdgeType, NotAllowedCreationType>
const notAllowedTypesMap: { [t in NotAllowedCreationType]: null } = {}
export const isAllowedCreationType = (_: EdgeType): _ is AllowedCreationType => !(_ in notAllowedTypesMap)
export const createHooks: {
  [T in AllowedCreationType]: CreateHook<T>
} = {
  Follows: async ({ ctx, from, to }) => {
    const { createEdge } = await getContentGraphPersistence()
    const createResult = await createEdge<EdgeType.Follows>({
      ctx,
      edgeType: EdgeType.Follows,
      from,
      to,
      data: {
        __typename: 'Follows',
      },
    })
    console.log('createResult', createResult)
    return createResult
  },
}
