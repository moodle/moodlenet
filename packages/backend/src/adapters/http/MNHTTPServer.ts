import cors from 'cors'
import express, { Application } from 'express'
import { Context } from '../../graphql/types'
import { execEnvMiddleware } from './executionContext'

declare module 'express-serve-static-core' {
  export interface Request {
    mnHttpContext: Context
  }
}

export type MountServiceName = 'graphql' | 'assets' | '.well-known'
export type MountServices = {
  [name in MountServiceName]: Application | null
}

interface MNHttpServerCfg {
  startServices: MountServices
  httpPort: number
}
const nameTag = `MN-HTTP-Server`

export const startMNHttpServer = ({ startServices, httpPort: port }: MNHttpServerCfg) => {
  console.log(`\n${nameTag}: initializing`)
  const app = express()
  const subServicesApp = express()
  app.use(cors())
  app.use(execEnvMiddleware)

  app.use('/', subServicesApp) //FIXME: should use('/_/'  ...
  Object.entries(startServices).forEach(([mountName, application]) => {
    if (!application) {
      return
    }
    console.log(`${nameTag}: mounting service [${mountName}]`)
    subServicesApp.use(`/${mountName}`, application)
  })

  return new Promise<void>((res, rej) => {
    app.on('error', e => rej(e))
    console.log(`${nameTag} starting on ${port}`)
    app.listen(port, () => {
      console.log(`${nameTag} listening on ${port}\n`)
      res()
    })
  })
}
