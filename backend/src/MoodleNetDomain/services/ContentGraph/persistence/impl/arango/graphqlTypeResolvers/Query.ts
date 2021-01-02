import { Resolvers } from '../../../../ContentGraph.graphql.gen'
import { DBReady } from '../ContentGraph.persistence.arango.env'
import { vertexResolver } from '../ContentGraph.persistence.arango.queries'

export const Query = DBReady.then<Resolvers['Query']>(({ db }) => ({
  user: vertexResolver({ db }),
  subject: vertexResolver({ db }),
}))
