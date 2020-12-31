import { makeExecutableSchema } from '@graphql-tools/schema'
import { Context, loadServiceSchema } from '../../../MoodleNetGraphQL'
import { userAccountResolvers } from './resolvers'

const { typeDefs } = loadServiceSchema({ srvName: 'UserAccount' })
export const schema = makeExecutableSchema<Context>({
  typeDefs,
  resolvers: userAccountResolvers,
})
