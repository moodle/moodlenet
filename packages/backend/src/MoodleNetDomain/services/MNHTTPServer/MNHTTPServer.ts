import cors from 'cors'
import express, { Application } from 'express'
import { MoodleNetExecutionContext } from '../../types'
import { MNExecCtxMiddleware } from './executionContext'

declare module 'express-serve-static-core' {
  export interface Request {
    mnHttpSessionCtx: MoodleNetExecutionContext<'session' | 'anon'>
  }
}

export type MountServices = {
  static: Application
  graphql: Application
  [name: string]: Application
}

interface MNHttpServerCfg {
  services: MountServices
  port: number
}

export const startMNHttpServer = ({ services, port }: MNHttpServerCfg) => {
  const app = express()
  const subServicesApp = express()
  app.use(cors())
  app.use(MNExecCtxMiddleware)

  app.use('/', subServicesApp) //FIXME: should use('/_/'  ...
  for (const mountName in services) {
    const srvApp = services[mountName]
    if (!srvApp) {
      console.warn(`prepareMNHttpServer: no Sub App for ${mountName}`)
      continue
    }
    console.log(`prepareMNHttpServer: mounting Sub App ${mountName}`)
    subServicesApp.use(`/${mountName}`, srvApp)
  }
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
