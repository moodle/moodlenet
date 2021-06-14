import cors from 'cors'
import express, { Application } from 'express'
import { VerifyOptions } from 'jsonwebtoken'
import { Context } from '../../graphql/types'
import { getMNExecEnvMiddleware } from './executionContext'

declare module 'express-serve-static-core' {
  export interface Request {
    mnHttpSessionEnv: Context
  }
}

export type MountServiceName = 'graphql' | 'assets'
export type MountServices = {
  [name in MountServiceName]: Application | null
}

interface MNHttpServerCfg {
  startServices: MountServices
  httpPort: number
  jwtPublicKey: string
  jwtVerifyOpts: VerifyOptions
}
const nameTag = `MN-HTTP-Server`

export const startMNHttpServer = ({ startServices, httpPort: port, jwtPublicKey, jwtVerifyOpts }: MNHttpServerCfg) => {
  console.log(`\n${nameTag}: initializing`)
  const app = express()
  const subServicesApp = express()
  app.use(cors())
  app.use(getMNExecEnvMiddleware({ jwtPublicKey, jwtVerifyOpts }))

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
