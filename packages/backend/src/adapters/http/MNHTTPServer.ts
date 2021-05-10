import cors from 'cors'
import express, { Application } from 'express'
import { VerifyOptions } from 'jsonwebtoken'
import { MoodleNetExecutionContext } from '../../graphql/types'
import { getMNExecCtxMiddleware } from './executionContext'

declare module 'express-serve-static-core' {
  export interface Request {
    mnHttpSessionCtx: MoodleNetExecutionContext<'session' | 'anon'>
  }
}

export type MountServiceName = 'graphql'
export type MountServices = {
  [name in MountServiceName]: Application
}

interface MNHttpServerCfg {
  startServices: MountServices
  httpPort: number
  jwtPublicKey: string
  jwtVerifyOpts: VerifyOptions
}

export const startMNHttpServer = ({ startServices, httpPort: port, jwtPublicKey, jwtVerifyOpts }: MNHttpServerCfg) => {
  const app = express()
  const subServicesApp = express()
  app.use(cors())
  app.use(getMNExecCtxMiddleware({ jwtPublicKey, jwtVerifyOpts }))

  app.use('/', subServicesApp) //FIXME: should use('/_/'  ...
  Object.entries(startServices).forEach(([mountName, application]) => {
    console.log(`prepareMNHttpServer: mounting Sub App ${mountName}`)
    subServicesApp.use(`/${mountName}`, application)
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
