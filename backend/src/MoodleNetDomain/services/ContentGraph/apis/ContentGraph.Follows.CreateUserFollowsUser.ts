import { GraphQLError } from 'graphql'
import { RespondApiHandler } from '../../../../lib/domain'
import { Api } from '../../../../lib/domain/api/types'
import {
  getAuthUserId,
  graphQLRequestApiCaller,
  loggedUserOnly,
} from '../../../MoodleNetGraphQL'
import { getContentGraphPersistence } from '../ContentGraph.env'
import { MutationResolvers } from '../ContentGraph.graphql.gen'
import { UserFollowsUserEdge } from '../persistence/glyph'
import { CreateRelationEdgeErrorMsg } from '../persistence/types'

export type CreateUserFollowsUserPersistence = (_: {
  follower: string
  followed: string
}) => Promise<UserFollowsUserEdge | CreateRelationEdgeErrorMsg>

export type CreateUserFollowsUserApi = Api<
  { follower: string; followed: string },
  { edge: UserFollowsUserEdge | CreateRelationEdgeErrorMsg }
>

export const CreateUserFollowsUserApiHandler = async () => {
  const { createUserFollowsUser } = await getContentGraphPersistence()

  const handler: RespondApiHandler<CreateUserFollowsUserApi> = async ({
    req: { followed, follower },
  }) => {
    const edge = await createUserFollowsUser({ followed, follower })
    return { edge }
  }

  return handler
}

export const followUserResolver: MutationResolvers['followUser'] = async (
  _parent,
  { userId: followed },
  context
) => {
  const auth = loggedUserOnly({ context })
  const follower = getAuthUserId(auth)
  const { res } = await graphQLRequestApiCaller({
    api: 'ContentGraph.Follows.CreateUserFollowsUser',
    req: { followed, follower },
  })
  if (res.___ERROR) {
    throw new GraphQLError(res.___ERROR.msg)
  } else if (typeof res.edge === 'string') {
    throw new GraphQLError(res.edge)
  } else {
    return res.edge
  }
}
