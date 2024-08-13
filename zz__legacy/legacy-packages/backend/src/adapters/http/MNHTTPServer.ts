import cors from 'cors'
import express, { Application, RequestHandler } from 'express'
import { Context } from '../../graphql/types'
import { execEnvMiddleware } from './executionContext'

declare module 'express-serve-static-core' {
  export interface Request {
    mnHttpContext: Context
  }
}

export type MountServiceName = 'graphql' | 'assets' | '.well-known' | 'unsplash' | ''
export type MountServices = {
  [name in MountServiceName]: Application | null | string
}

interface MNHttpServerCfg {
  startServices: MountServices
  httpPort: number
  defaultGet?: RequestHandler
}
const nameTag = `MN-HTTP-Server`

export const startMNHttpServer = ({ startServices, httpPort: port, defaultGet }: MNHttpServerCfg) => {
  console.log(`\n${nameTag}: initializing`)
  const app = express()
  const subServicesApp = express()
  app.use(cors())
  app.use(execEnvMiddleware)

  app.use('/', subServicesApp) //FIXME: should use('/_/'  ...
  Object.entries(startServices).forEach(([mountName, application]) => {
    if (application === null) {
      return
    }
    const mountPoint = `/${mountName}`
    console.log(`${nameTag}: mounting service [${mountPoint}]`)
    if (typeof application === 'string') {
      console.log('static ', application)
    }
    const middleware = typeof application === 'string' ? express.static(application) : application
    subServicesApp.use(mountPoint, middleware)
  })
  defaultGet && app.get('(/*)?', defaultGet)

  return new Promise<void>((res, rej) => {
    app.on('error', e => rej(e))
    console.log(`${nameTag} starting on ${port}`)
    app.listen(port, () => {
      console.log(`${nameTag} listening on ${port}\n`)
      res()
    })
  })
}
