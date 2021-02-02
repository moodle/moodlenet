import { MoodleNetExecutionContext } from '../../../../../types'
import { getContentGraphPersistence } from '../../../ContentGraph.env'
import { CreateNodeInput, NodeType } from '../../../ContentGraph.graphql.gen'
import { CreateNodeShallowPayload } from '../../../persistence/types'

type Just<T> = Exclude<T, null | undefined>

export type CreateHook<T extends NodeType> = (_: {
  input: Just<CreateNodeInput[T]>
  ctx: MoodleNetExecutionContext
}) => Promise<CreateNodeShallowPayload<T>>

type NotAllowedCreationType = NodeType.User
export type AllowedCreationType = Exclude<NodeType, NotAllowedCreationType>
const notAllowedTypesMap: { [t in NotAllowedCreationType]: null } = {
  User: null,
}
export const isAllowedCreationType = (_: NodeType): _ is AllowedCreationType =>
  !(_ in notAllowedTypesMap)
export const createHooks: {
  [T in AllowedCreationType]: CreateHook<T>
} = {
  Subject: async ({ input, ctx }) => {
    const { createNode } = await getContentGraphPersistence()
    const createResult = await createNode<NodeType.Subject>({
      ctx,
      nodeType: NodeType.Subject,
      data: {
        __typename: 'Subject',
        name: input.name,
      },
    })
    return createResult
  },
}
