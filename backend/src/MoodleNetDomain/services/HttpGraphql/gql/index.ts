import { makeExecutableSchema } from 'apollo-server-express'
import { applyMiddleware } from 'graphql-middleware'
import { resolvers } from './resolvers'
import { directiveResolvers } from './directives'
import { middlewares } from './middlewares'
import { typeDefs } from '../../../graphqlTypeDefs'
import { Context } from '../../../GQL'

const _schema = makeExecutableSchema<Context>({
  typeDefs: [typeDefs],
  resolvers: resolvers as any,
  directiveResolvers,
})

export const schema = applyMiddleware(_schema, ...middlewares)
