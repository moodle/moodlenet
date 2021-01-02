import { Resolvers } from '../../../../ContentGraph.graphql.gen'
import { DBReady } from '../contentGraph.persistence.arango.env'
import { vertexResolver } from '../contentGraph.queries'

export const Query = DBReady.then<Resolvers['Query']>(({ db }) => ({
  user: vertexResolver({ db }),
  subject: vertexResolver({ db }),
}))
