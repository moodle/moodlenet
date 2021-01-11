import { defaultFieldResolver } from 'graphql'
import { Resolvers } from '../../../../ContentGraph.graphql.gen'
import { DBReady } from '../ContentGraph.persistence.arango.env'
import { edgesResolver } from '../ContentGraph.persistence.arango.queries'

export const Collection = DBReady.then<Resolvers['Collection']>(
  ({ ContainsEdges, FollowsEdges, ReferencesEdges, db }) => ({
    containsResources: edgesResolver({
      db,
      collection: ContainsEdges,
      typenames: ['CollectionContainsResource'],
    }),
    followers: edgesResolver({
      db,
      collection: FollowsEdges,
      typenames: ['UserFollowsCollection'],
      reverse: true,
    }),
    subjectReferences: edgesResolver({
      db,
      collection: ReferencesEdges,
      typenames: ['CollectionReferencesSubject'],
    }),
    _id: defaultFieldResolver,
    name: defaultFieldResolver,
  })
)
