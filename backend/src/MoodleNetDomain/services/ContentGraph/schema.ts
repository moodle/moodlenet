import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchema } from '@graphql-tools/load'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { printSchema } from 'graphql'
import { MoodleNetGraphQLContext } from '../../MoodleNetDomain'
import { getContentGraphEngine } from './Content-Graph.env'

export const getContentGraphExecutableSchema = async () => {
  const schema = await loadSchema(`${__dirname}/graphql/**/*.graphql`, {
    loaders: [new GraphQLFileLoader()],
  })
  const { graphQLResolvers } = await getContentGraphEngine()
  return makeExecutableSchema<MoodleNetGraphQLContext>({
    typeDefs: printSchema(schema),
    resolvers: graphQLResolvers,
  })
}
