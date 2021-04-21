import { Application } from 'express'
import { graphqlHTTP } from 'express-graphql'
import { schema } from '../../MoodleNetGraphQL'

interface HttpGatewayCfg {
  app: Application
}
export const startGraphQLHTTPGateway = ({ app }: HttpGatewayCfg) => {
  app.use(
    '/graphql',
    graphqlHTTP({
      schema,
      graphiql: { headerEditorEnabled: true },
    }),
  )
}
