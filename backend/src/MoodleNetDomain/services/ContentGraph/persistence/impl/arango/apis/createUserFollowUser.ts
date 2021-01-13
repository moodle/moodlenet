import { UserFollowsUserEdge } from '../../../glyph'
import { ContentGraphPersistence } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'
import { createRelationEdge } from '../ContentGraph.persistence.arango.queries'

export const createUserFollowUser = DBReady.then(
  ({ db }): ContentGraphPersistence['createUserFollowUser'] => async ({
    followed,
    follower,
  }) => {
    return createRelationEdge<UserFollowsUserEdge>({
      _from: follower,
      _to: followed,
      data: { __typename: 'UserFollowsUser' },
      db,
      edgeCollectionName: 'Follows',
      graphName: 'Follows',
      allowMultiple: false,
      reverse: false,
    })
  }
)
