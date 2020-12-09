import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import executor from './executor'
import { schema } from './gql'
import { env } from './http-gql-server.env'

const app = express()
const apollo = new ApolloServer({
  schema,
  executor,
})
apollo.applyMiddleware({ app })
app.listen(env.port)
