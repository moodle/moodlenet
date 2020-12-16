import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { GraphQLError } from 'graphql'
import { INVALID_TOKEN, verifyJwt } from '../../domain.helpers'
import { Context, RootValue } from '../../GQL'
import { schema } from './gql'
import { env } from './http-gql-server.env'

const app = express()

app.use((_req, _res, next) => {
  next()
})

const apollo = new ApolloServer({
  schema,
  context({ req /*, res, connection */ }) {
    const jwtToken = req.header('bearer') || undefined
    const jwt = verifyJwt(jwtToken)
    if (jwt === INVALID_TOKEN) {
      return {
        errors: [new GraphQLError('invalid jwt token')],
      }
    }
    const ctx: Context = { jwt }
    return ctx
  },
  rootValue() {
    const rootValue: RootValue = {}
    return rootValue
  },
})
apollo.applyMiddleware({ app })
app.listen(env.port)
