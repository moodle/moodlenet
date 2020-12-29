import { makeExecutableSchema } from '@graphql-tools/schema'
import { loadMoodleNetServiceSchema, Context } from '../../MoodleNetGraphQL'
import { getContentGraphEngine } from './Content-Graph.env'

export const getContentGraphExecutableSchema = async () => {
  const { typeDefs } = loadMoodleNetServiceSchema({
    path: `${__dirname}/graphql/**/*.graphql`,
  })
  const { graphQLResolvers } = await getContentGraphEngine()
  return makeExecutableSchema<Context>({
    typeDefs,
    resolvers: graphQLResolvers,
  })
}
