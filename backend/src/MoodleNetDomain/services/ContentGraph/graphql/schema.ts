import { makeExecutableSchema } from '@graphql-tools/schema'
import { Context, loadServiceSchema } from '../../../MoodleNetGraphQL'
import { getContentGraphPersistence } from '../ContentGraph.env'
import { Resolvers } from '../ContentGraph.graphql.gen'
import { stitchingDirectives } from '@graphql-tools/stitching-directives'

export const getContentGraphExecutableSchema = async () => {
  const { graphQLTypeResolvers } = await getContentGraphPersistence()

  const { typeDefs } = loadServiceSchema({ srvName: 'ContentGraph' })

  const resolvers: Resolvers = {
    ...graphQLTypeResolvers,
    Mutation: {} as any,
  }

  const { stitchingDirectivesValidator } = stitchingDirectives()
  const schema = makeExecutableSchema<Context>({
    schemaTransforms: [stitchingDirectivesValidator],
    typeDefs,
    resolvers,
  })

  return schema
}
