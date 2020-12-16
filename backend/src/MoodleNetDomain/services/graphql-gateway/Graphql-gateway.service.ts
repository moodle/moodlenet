import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { INVALID_TOKEN, verifyJwt } from '../../domain.helpers'
import { Context, RootValue } from '../../GQL'
import { env } from './Graphql-gateway.env'
import { schema } from './schema'

const app = express()

app.use((_req, _res, next) => {
  next()
})

const apollo = new ApolloServer({
  schema,
  context({ req /*, res, connection */ }) {
    const jwtTokenHeader = req.header('bearer')
    const maybejwt = verifyJwt(jwtTokenHeader)
    const jwt = maybejwt === INVALID_TOKEN ? undefined : maybejwt
    const ctx: Context = {
      jwt,
    }
    return ctx
  },
  rootValue() {
    const rootValue: RootValue = {}
    return rootValue
  },
})
apollo.applyMiddleware({ app })
app.listen(env.port)
