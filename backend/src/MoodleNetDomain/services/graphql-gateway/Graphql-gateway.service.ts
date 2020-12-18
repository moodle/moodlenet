import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { INVALID_TOKEN, verifyJwt } from '../../domain.helpers'
import { Context, RootValue } from '../../GQL'
import { env } from './Graphql-gateway.env'
import { schema } from './schema'
import { graphql, GraphQLError } from 'graphql'
const app = express()

app.use((_req, _res, next) => {
  next()
})

const apollo = new ApolloServer({
  schema,
  // context({ req /*, res, connection */ }) {
  //   const jwtTokenHeader = req.header('bearer')
  //   const maybejwt = verifyJwt(jwtTokenHeader)
  //   const jwt = maybejwt === INVALID_TOKEN ? undefined : maybejwt
  //   const ctx: Context = {
  //     jwt,
  //   }
  //   return ctx
  // },
  // rootValue() {
  //   const rootValue: RootValue = {}
  //   return rootValue
  // },
  executor: async (ctx) => {
    const { request, schema, source } = ctx
    const { http, operationName, query, variables } = request
    const jwtToken = http?.headers.get('bearer') || undefined
    const jwt = verifyJwt(jwtToken)
    if (jwt === INVALID_TOKEN) {
      return {
        errors: [new GraphQLError('invalid jwt token')],
      }
    }
    const gqlReq = {
      operationName,
      variableValues: variables,
      source: query || source,
    }
    const contextValue: Context = {
      jwt,
      gqlReq,
    }
    const rootValue: RootValue = {}

    return await graphql({
      ...gqlReq,
      contextValue,
      rootValue,
      schema,
    })
  },
})
apollo.applyMiddleware({ app })
app.listen(env.port)
