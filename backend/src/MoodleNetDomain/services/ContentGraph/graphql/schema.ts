import { makeExecutableSchema } from '@graphql-tools/schema'
import { Context, loadServiceSchema } from '../../../MoodleNetGraphQL'
import { getContentGraphPersistence } from '../ContentGraph.env'
import { Resolvers } from '../ContentGraph.graphql.gen'
import { stitchingDirectives } from '@graphql-tools/stitching-directives'
import { printSchema } from 'graphql'
import { Mutation } from './mutationResolvers'

export const getContentGraphExecutableSchema = async () => {
  const { graphQLTypeResolvers } = await getContentGraphPersistence()

  const srvSchema = loadServiceSchema({ srvName: 'ContentGraph' })

  const resolvers: Resolvers = {
    ...graphQLTypeResolvers,
    Mutation,
  }

  const { stitchingDirectivesValidator } = stitchingDirectives()
  const schema = makeExecutableSchema<Context>({
    schemaTransforms: [stitchingDirectivesValidator],
    typeDefs: printSchema(srvSchema),
    resolvers,
  })

  return schema
}
