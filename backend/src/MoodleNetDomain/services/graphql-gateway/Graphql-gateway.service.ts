import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { INVALID_TOKEN, verifyJwt } from '../../domain.helpers'
import { Context, RootValue } from '../../GQL'
import { env } from './Graphql-gateway.env'
import { schema } from './schema'
import { graphql, GraphQLError } from 'graphql'

schema().then((schema) => {
  const app = express()

  app.use((_req, _res, next) => {
    next()
  })
  app.use(
    '/graphql',
    graphqlHTTP({
      schema,
      graphiql: true,
    })
  )

  // executor: async (ctx) => {
  //   const { request, schema, source } = ctx
  //   const { http, operationName, query, variables } = request
  //   const jwtToken = http?.headers.get('bearer') || undefined
  //   const jwt = verifyJwt(jwtToken)
  //   if (jwt === INVALID_TOKEN) {
  //     return {
  //       errors: [new GraphQLError('invalid jwt token')],
  //     }
  //   }
  //   const gqlReq = {
  //     operationName,
  //     variableValues: variables,
  //     source: query || source,
  //   }
  //   const contextValue: Context = {
  //     jwt,
  //     gqlReq,
  //   }
  //   const rootValue: RootValue = {}

  //   const gqlresp = await graphql({
  //     ...gqlReq,
  //     contextValue,
  //     rootValue,
  //     schema,
  //   })
  //   return gqlresp
  // },

  app.listen(env.port)
})
