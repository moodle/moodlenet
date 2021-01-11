import { defaultFieldResolver } from 'graphql'
import { Resolvers } from '../../../../ContentGraph.graphql.gen'
import { DBReady } from '../ContentGraph.persistence.arango.env'
import { edgesResolver } from '../ContentGraph.persistence.arango.queries'

export const User = DBReady.then<Resolvers['User']>(
  ({ FollowsEdges, LikesEdges, db }) => ({
    followers: edgesResolver({
      db,
      collection: FollowsEdges,
      typenames: ['UserFollowsUser'],
      reverse: true,
    }),
    followsSubjects: edgesResolver({
      db,
      collection: FollowsEdges,
      typenames: ['UserFollowsSubject'],
    }),
    followsUsers: edgesResolver({
      db,
      collection: FollowsEdges,
      typenames: ['UserFollowsUser'],
    }),
    followsCollections: edgesResolver({
      db,
      collection: FollowsEdges,
      typenames: ['UserFollowsCollection'],
    }),
    likesResources: edgesResolver({
      db,
      collection: LikesEdges,
      typenames: ['UserLikesResource'],
    }),
    _id: defaultFieldResolver,
    displayName: defaultFieldResolver,
  })
)
