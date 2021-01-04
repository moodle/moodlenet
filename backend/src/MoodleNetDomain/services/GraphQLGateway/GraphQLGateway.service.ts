import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { env } from './GraphQLGateway.env'
import { schema } from '../../MoodleNetGraphQL'

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
