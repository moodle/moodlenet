import { makeExecutableSchema } from '@graphql-tools/schema'
import introspection from '@moodlenet/common/lib/graphql/introspection'
import { Application, Request } from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildClientSchema, graphql, print, printSchema } from 'graphql'
import { SignOptions } from 'jsonwebtoken'
import { getGQLResolvers } from '../../graphql/resolvers'
import { Context, RootValue } from '../../graphql/types'
import { JwtPrivateKey } from '../../lib/auth/jwt'
import { PasswordVerifier } from '../../lib/auth/types'
import { QMino } from '../../lib/qmino'

export type GQLAppConfig = {
  additionalResolvers: object | null
  jwtSignOptions: SignOptions
  jwtPrivateKey: JwtPrivateKey
  passwordVerifier: PasswordVerifier
  qmino: QMino
}
export const createGraphQLApp = ({
  additionalResolvers,
  jwtPrivateKey,
  jwtSignOptions,
  qmino,
  passwordVerifier,
}: GQLAppConfig) => {
  const mainResolvers = getGQLResolvers({
    jwtPrivateKey,
    jwtSignOptions,
    qmino,
    passwordVerifier,
  })
  const schema = makeExecutableSchema({
    typeDefs: printSchema(buildClientSchema(introspection as any)), // ? don't know why it doesn' accept IntrospectionQuery
    resolvers: { ...mainResolvers, ...additionalResolvers },
  })
  const middleware = graphqlHTTP({
    graphiql: { headerEditorEnabled: true },
    schema,
    customExecuteFn(args) {
      const httpReq = args.contextValue as unknown as Request
      const contextValue: Context = httpReq.mnHttpSessionEnv
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
