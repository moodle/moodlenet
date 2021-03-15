import cors from 'cors'
import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { schema } from '../../MoodleNetGraphQL'

interface HttpGatewayCfg {
  port: number
}
export const starthttpGateway = ({ port }: HttpGatewayCfg) => {
  console.log(`starting on ${port}`)

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

  app.listen(port, () => console.log(`listening on ${port}`))
}
