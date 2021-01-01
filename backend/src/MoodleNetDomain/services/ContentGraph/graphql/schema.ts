import { makeExecutableSchema } from '@graphql-tools/schema'
import { Context, loadServiceSchema } from '../../../MoodleNetGraphQL'
import { getContentGraphPersistence } from '../ContentGraph.env'

export const getContentGraphExecutableSchema = async () => {
  const {
    graphQLTypeResolvers: graphQLResolvers,
  } = await getContentGraphPersistence()

  const { typeDefs } = loadServiceSchema({ srvName: 'ContentGraph' })

  return makeExecutableSchema<Context>({
    typeDefs,
    resolvers: graphQLResolvers,
  })
}
