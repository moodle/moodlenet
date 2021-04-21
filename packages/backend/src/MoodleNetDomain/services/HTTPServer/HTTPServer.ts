import cors from 'cors'
import express from 'express'
import { MoodleNetExecutionContext } from '../../types'
import { MNExecCtxMiddleware } from './executionContext'

declare module 'express-serve-static-core' {
  export interface Request {
    mnHttpSessionCtx: MoodleNetExecutionContext<'session' | 'anon'>
  }
}
interface HttpServerCfg {
  port: number
}
export const startHttpServer = ({ port }: HttpServerCfg) => {
  console.log(`starting HttpServer on ${port}`)

  const root = express()
  root.use(cors())
  root.use(MNExecCtxMiddleware)

  root.listen(port, () => console.log(`HttpServer listening on ${port}`))

  const serviceRoot = root // FIXME: create a partition for services ( e.g. root.use('/_/') )

  return {
    root,
    serviceRoot,
  }
}
