import { makeExecutableSchema } from '@graphql-tools/schema'
import introspection from '@moodlenet/common/dist/graphql/introspection'
import { Application, Request } from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildClientSchema, graphql, print, printSchema } from 'graphql'
import { getGQLResolvers } from '../../graphql/resolvers'
import { RootValue } from '../../graphql/types'

export type GQLAppConfig = {
  additionalResolvers: object | null
}
export const createGraphQLApp = ({ additionalResolvers }: GQLAppConfig) => {
  const mainResolvers = getGQLResolvers()
  const schema = makeExecutableSchema({
    typeDefs: printSchema(buildClientSchema(introspection as any)), // ? don't know why it doesn' accept IntrospectionQuery
    resolvers: { ...mainResolvers, ...additionalResolvers },
  })
  const middleware = graphqlHTTP({
    graphiql: { headerEditorEnabled: true },
    schema,
    customExecuteFn(args) {
      const httpReq = args.contextValue as unknown as Request
      const contextValue = httpReq.mnHttpContext
      const rootValue: RootValue = {}
      const source = print(args.document)
      return graphql({
        ...args,
        rootValue,
        contextValue,
        source,
      })
    },
  })
  return middleware as Application
}
