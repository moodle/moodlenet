import { makeExecutableSchema } from '@graphql-tools/schema'
import { Context, loadServiceSchema } from '../../../MoodleNetGraphQL'
import { getAccountPersistence } from '../UserAccount.env'
import { Resolvers } from '../UserAccount.graphql.gen'
import { Mutation } from './mutationResolvers'

export const getUserAccountSchema = async () => {
  const { graphQLTypeResolvers } = await getAccountPersistence()

  const { typeDefs } = loadServiceSchema({ srvName: 'UserAccount' })

  const resolvers: Resolvers = {
    ...graphQLTypeResolvers,
    Mutation,
  }

  const schema = makeExecutableSchema<Context>({
    typeDefs,
    resolvers,
  })

  return schema
}
