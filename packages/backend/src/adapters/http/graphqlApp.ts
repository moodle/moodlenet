import { makeExecutableSchema } from '@graphql-tools/schema'
import introspection from '@moodlenet/common/lib/graphql/introspection'
import { Application, Request } from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildClientSchema, graphql, print, printSchema } from 'graphql'
import { getGQLResolvers } from '../../graphql/resolvers'
import { MoodleNetExecutionContext, RootValue } from '../../graphql/types'
import { newAnonCtx } from '../lib/executionContext'

export type GQLAppConfig = {
  additionalResolvers: any
}
export const createGraphQLApp = ({ additionalResolvers }: GQLAppConfig) => {
  const mainResolvers = getGQLResolvers()
  const schema = makeExecutableSchema({
    typeDefs: printSchema(buildClientSchema(introspection)),
    resolvers: { ...mainResolvers, ...additionalResolvers },
  })
  const middleware = graphqlHTTP({
    graphiql: { headerEditorEnabled: true },
    schema,
    customExecuteFn(args) {
      const httpReq = (args as unknown) as Request
      const contextValue: MoodleNetExecutionContext<'anon' | 'session'> = httpReq?.mnHttpSessionCtx ?? newAnonCtx()
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
