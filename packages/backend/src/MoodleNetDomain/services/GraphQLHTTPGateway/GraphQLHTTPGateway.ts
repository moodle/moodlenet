import { Router } from 'express'
import { graphqlHTTP } from 'express-graphql'
import { schema } from '../../MoodleNetGraphQL'

interface HttpGatewayCfg {
  router: Router
}
export const attachGraphQLHTTPGateway = ({ router }: HttpGatewayCfg) => {
  router.use(
    '/graphql',
    graphqlHTTP({
      schema,
      graphiql: { headerEditorEnabled: true },
    }),
  )
}
