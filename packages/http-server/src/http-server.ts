import type { ExtShell } from '@moodlenet/core'
import cookieParser from 'cookie-parser'
import express, { Application } from 'express'
import type { Server } from 'http'
import gracefulShutdown from 'http-graceful-shutdown'
import type { MNHttpServerExt, MountAppItem, PriMsgBaseUrl, SessionTokenCookieName } from '.'
import { makeExtPortsApp } from './ext-ports-app'

type Cfg = { shell: ExtShell<MNHttpServerExt>; port: number }

const basePriMsgUrl: PriMsgBaseUrl = '/_/_'
const SESSION_TOKEN_COOKIE_NAME: SessionTokenCookieName = 'mn-session'
// const SESSION_TOKEN_HEADER_NAME: SessionTokenHeaderName = SESSION_TOKEN_COOKIE_NAME

export function createHttpServer({ shell, port }: Cfg) {
  const [, auth] = shell.deps
  const extPortsApp = makeExtPortsApp(shell)

  let server: Server
  let app: Application
  let mountedApps: MountAppItem[] = []
  let shutdownGracefully: () => Promise<void>
  start()
  return {
    get: () => ({ server, mainApp: app }),
    mountApp,
    stop,
    restart,
  }

  function mountApp(mountItem: MountAppItem) {
    mountedApps = [...mountedApps, mountItem]
    app.use(mountItem.mountPath, mountItem.getApp())
    return () => {
      mountedApps = mountedApps.filter(_ => _ !== mountItem)
      return restart()
    }
  }

  async function restart() {
    await stop()
    await start()
  }

  async function stop() {
    const err = await shutdownGracefully().catch(err => err)
    console.info(`Stopped HTTP-lifecycle server with err:`, err)
    //     return new Promise<void>((resolve, reject) => {
    //   server.close(err => {
    //     console.info(`Stopped HTTP-lifecycle server with err:`, err)
    //     err ? reject(err) : resolve()
    //   })req.cookies
    // })
  }
  function start() {
    app = express()
      .use(cookieParser())
      .use(`/`, async (req, __, next) => {
        req.moodlenet = {}
        const maybeSessionToken = req.cookies[SESSION_TOKEN_COOKIE_NAME]
        if ('string' === typeof maybeSessionToken) {
          const {
            msg: { data: resp },
          } = await auth.access.fetch('getClientSession')({ token: maybeSessionToken })
          if (resp.success) {
            req.moodlenet.clientSession = resp.clientSession
          }
        }
        next()
      })
    app.use(basePriMsgUrl, extPortsApp)
    mountedApps.forEach(({ getApp, mountPath }) => {
      app.use(mountPath, getApp())
    })
    return new Promise<void>((resolve, reject) => {
      console.info(`Starting HTTP-lifecycle server on port ${port}`)
      server = app.listen(port, function () {
        arguments[0] ? reject(arguments[0]) : resolve()
      })
      shutdownGracefully = gracefulShutdown(server, { development: false, forceExit: false, timeout: 1000 })
      console.info(`HTTP-lifecycle listening on port ${port} :)`)
    })
  }
}
