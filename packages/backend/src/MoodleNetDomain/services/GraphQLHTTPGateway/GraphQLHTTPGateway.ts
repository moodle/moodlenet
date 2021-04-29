import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { schema } from '../../MoodleNetGraphQL'

interface HttpGatewayCfg {}
export const attachGraphQLHTTPGateway = (_: HttpGatewayCfg) => {
  const app = express()
  app.use(
    '/',
    graphqlHTTP({
      schema,
      graphiql: { headerEditorEnabled: true },
    }),
  )
  return app
}
