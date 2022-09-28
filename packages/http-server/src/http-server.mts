import cookieParser from 'cookie-parser'
import express, { Application } from 'express'
import type { Server } from 'http'
import gracefulShutdown from 'http-graceful-shutdown'
import { makeExtPortsApp } from './ext-ports-app/make.mjs'
import { BASE_APIS_URL, SESSION_TOKEN_COOKIE_NAME } from './ext-ports-app/pub-lib.mjs'
import { env } from './init.mjs'
import type { MountAppItem } from './types.mjs'

export function createHttpServer() {
  const extPortsApp = makeExtPortsApp()

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
    console.log(`http mountApp ${mountItem.mountAppArgs.mountOnAbsPath ?? mountItem.mountPath}`)
    app.use(mountItem.mountPath, mountItem.mountAppArgs.getApp(express))
    restart()
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
        req.moodlenet.authToken = req.cookies[SESSION_TOKEN_COOKIE_NAME]
        next()
      })
    app.use(`${BASE_APIS_URL}/`, extPortsApp)
    mountedApps.forEach(({ mountAppArgs, mountPath }) => {
      console.log(`http mounting ${mountPath}`)
      app.use(mountPath, mountAppArgs.getApp(express))
    })
    return new Promise<void>((resolve, reject) => {
      console.info(`Starting HTTP-lifecycle server on port ${env.port}`)
      server = app.listen(env.port, function () {
        arguments[0] ? reject(arguments[0]) : resolve()
      })
      shutdownGracefully = gracefulShutdown(server, { development: false, forceExit: false, timeout: 1000 })
      console.info(`HTTP-lifecycle listening on port ${env.port} :)`)
    })
  }
}
