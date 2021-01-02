import { defaultFieldResolver } from 'graphql'
import { Resolvers } from '../../../../ContentGraph.graphql.gen'
import { DBReady } from '../ContentGraph.persistence.arango.env'
import { edgesResolver } from '../ContentGraph.persistence.arango.queries'

export const User = DBReady.then<Resolvers['User']>(({ FollowsEdges, db }) => ({
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
  _id: defaultFieldResolver,
  name: defaultFieldResolver,
}))
