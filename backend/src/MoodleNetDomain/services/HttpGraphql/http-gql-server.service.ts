import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import executor from './executor'
import { env } from './http-gql-server.env'
import { schema } from './gql'

const app = express()
const apollo = new ApolloServer({ schema, executor })
apollo.applyMiddleware({ app })
app.listen(env.port)
