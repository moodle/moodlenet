import { makeExecutableSchema } from '@graphql-tools/schema'
import introspection from '@moodlenet/common/lib/graphql/introspection'
import cors from 'cors'
import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildClientSchema, printSchema } from 'graphql'
import { getGQLResolvers } from '../../graphql/resolvers'
import { MoodleNetExecutionContext } from '../executionContext/types'
import { MNExecCtxMiddleware } from './executionContext'

declare module 'express-serve-static-core' {
  export interface Request {
    mnHttpSessionCtx: MoodleNetExecutionContext<'session' | 'anon'>
  }
}

export type MountServices =
  // |  'static'
  'graphql'

interface MNHttpServerCfg {
  startServices: MountServices[]
  port: number
}

export const startMNHttpServer = ({ startServices, port }: MNHttpServerCfg) => {
  const app = express()
  const subServicesApp = express()
  app.use(cors())
  app.use(MNExecCtxMiddleware)

  app.use('/', subServicesApp) //FIXME: should use('/_/'  ...
  startServices.forEach(mountName => {
    const srvApp = services[mountName]
    console.log(`prepareMNHttpServer: mounting Sub App ${mountName}`)
    subServicesApp.use(`/${mountName}`, srvApp)
  })

  return new Promise<void>((res, rej) => {
    const nameTag = `MN-HTTP-Server`
    app.on('error', e => rej(e))
    console.log(`starting ${nameTag} on ${port}`)
    app.listen(port, () => {
      console.log(`${nameTag} listening on ${port}`)
      res()
    })
  })
}
const resolvers = getGQLResolvers()
const schema = makeExecutableSchema({
  typeDefs: printSchema(buildClientSchema(introspection)),
  resolvers,
})

const services = {
  graphql: graphqlHTTP({
    graphiql: { headerEditorEnabled: true },
    schema,
  }),
}
