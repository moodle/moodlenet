import { makeExecutableSchema } from '@graphql-tools/schema'
import { Context, loadServiceSchema } from '../../MoodleNetGraphQL'
import { getContentGraphEngine } from './ContentGraph.env'

export const getContentGraphExecutableSchema = async () => {
  const { graphQLResolvers } = await getContentGraphEngine()

  const { typeDefs } = loadServiceSchema({ srvName: 'ContentGraph' })

  return makeExecutableSchema<Context>({
    typeDefs,
    resolvers: graphQLResolvers,
  })
}
