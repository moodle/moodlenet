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
export const prepareHttpServer = ({ port }: HttpServerCfg) => {
  const root = express()
  root.use(cors())
  root.use(MNExecCtxMiddleware)
  const serviceRouter = root //Router().connect('/_/*', root) // FIXME: create a partition for services ( e.g. root.use('/_/') )

  const start = () =>
    new Promise<void>((res, rej) => {
      root.on('error', e => rej(e))
      console.log(`starting HttpServer on ${port}`)
      root.listen(port, () => {
        console.log(`HttpServer listening on ${port}`)
        res()
      })
    })

  return {
    root,
    serviceRouter,
    start,
  }
}
