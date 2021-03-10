import cors from 'cors'
import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { schema } from '../../MoodleNetGraphQL'
import { httpCfg } from './GraphQLHTTPGateway.env'

const env = httpCfg()
console.log(`starting on ${env.port}`)

const app = express()
app.use(cors())

app.use((_req, _res, next) => {
  next()
})
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: { headerEditorEnabled: true },
  }),
)

app.listen(env.port, () => console.log(`listening on ${env.port}`))
