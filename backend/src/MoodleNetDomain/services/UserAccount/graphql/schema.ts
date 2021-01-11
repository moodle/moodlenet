import { makeExecutableSchema } from '@graphql-tools/schema'
import {
  Context,
  loadServiceSchema,
  globDirectiveResolvers,
} from '../../../MoodleNetGraphQL'
import { getAccountPersistence } from '../UserAccount.env'
import { Resolvers } from '../UserAccount.graphql.gen'
import { Mutation } from './mutationResolvers'
import { stitchingDirectives } from '@graphql-tools/stitching-directives'
import { printSchema } from 'graphql'

export const getUserAccountSchema = async () => {
  const { graphQLTypeResolvers } = await getAccountPersistence()

  const srvShema = loadServiceSchema({ srvName: 'UserAccount' })

  const resolvers: Resolvers = {
    ...graphQLTypeResolvers,
    Mutation,
  }

  const { stitchingDirectivesValidator } = stitchingDirectives()
  const schema = makeExecutableSchema<Context>({
    schemaTransforms: [stitchingDirectivesValidator],
    typeDefs: printSchema(srvShema),
    directiveResolvers: globDirectiveResolvers,
    resolvers,
  })

  return schema
}
