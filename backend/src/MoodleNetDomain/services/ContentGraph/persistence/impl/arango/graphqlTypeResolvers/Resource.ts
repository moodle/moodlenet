import { defaultFieldResolver } from 'graphql'
import { Resolvers } from '../../../../ContentGraph.graphql.gen'
import { DBReady } from '../ContentGraph.persistence.arango.env'
import { edgesResolver } from '../ContentGraph.persistence.arango.queries'

export const Resource = DBReady.then<Resolvers['Resource']>(
  ({ ContainsEdges, LikesEdges, ReferencesEdges, db }) => ({
    containers: edgesResolver({
      db,
      collection: ContainsEdges,
      typenames: ['CollectionContainsResource'],
      reverse: true,
    }),
    likers: edgesResolver({
      db,
      collection: LikesEdges,
      typenames: ['UserLikesResource'],
      reverse: true,
    }),
    subjectReferences: edgesResolver({
      db,
      collection: ReferencesEdges,
      typenames: ['ResourceReferencesSubject'],
    }),
    _id: defaultFieldResolver,
    name: defaultFieldResolver,
  })
)
