import { RespondApiHandler } from '../../../../lib/domain'
import { Api } from '../../../../lib/domain/api/types'
import { getContentGraphPersistence } from '../ContentGraph.env'
import { NodeType, User } from '../ContentGraph.graphql.gen'
import { ShallowNode } from '../persistence/types'

export type UserByIdApi = Api<
  { userId: string },
  { user: ShallowNode<User> | null }
>

export const UserByIdApiHandler = async () => {
  const { findNode } = await getContentGraphPersistence()

  const handler: RespondApiHandler<UserByIdApi> = async ({
    req: { userId },
  }) => {
    const user = (await findNode({
      _id: userId,
      nodeType: NodeType.User,
    })) as ShallowNode<User> | null
    return { user }
  }

  return handler
}
