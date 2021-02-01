import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { httpCfg } from './GraphQLHTTPGateway.env'
import { schema } from '../../MoodleNetGraphQL'

const env = httpCfg()
const app = express()

app.use((_req, _res, next) => {
  next()
})
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: { headerEditorEnabled: true },
  })
)

app.listen(env.port)
