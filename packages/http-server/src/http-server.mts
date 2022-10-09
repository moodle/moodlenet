import cookieParser from 'cookie-parser'
import express, { Application } from 'express'
import type { Server } from 'http'
import gracefulShutdown from 'http-graceful-shutdown'
import { makeExtPortsApp } from './ext-ports-app/make.mjs'
import {
  BASE_APIS_URL,
  BASE_PKG_MOUNT_URL,
  SESSION_TOKEN_COOKIE_NAME,
} from './ext-ports-app/pub-lib.mjs'
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
    console.log(`HTTP: register mountApp for ${mountItem.pkgId.name}`)
    //    app.use(mountItem.mountPath, mountItem.mountAppArgs.getApp(express))
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
    console.info(`HTTP: stopped with ${err ? 'error:' : 'no error'}`, err ?? '')
  }
  function start() {
    app = express()
      .use(cookieParser())
      .use(`*`, async (req, __, next) => {
        // console.log({ cookies: req.cookies })
        req.moodlenet = {}
        req.moodlenet.authToken = req.cookies[SESSION_TOKEN_COOKIE_NAME]
        next()
      })
    app.use(`${BASE_APIS_URL}/`, extPortsApp)
    const pkgAppContainer = express()
    app.use(`${BASE_PKG_MOUNT_URL}/`, pkgAppContainer)
    mountedApps.forEach(({ mountAppArgs, mountOnAbsPath, pkgId }) => {
      const pkgApp = mountAppArgs.getApp(express)
      if (mountOnAbsPath) {
        console.log(`HTTP: mounting ${mountOnAbsPath} for ${pkgId.name}`)
        app.use(`/${mountOnAbsPath}/`, pkgApp)
      } else {
        console.log(`HTTP: mounting ${BASE_PKG_MOUNT_URL}/${pkgId.name}/ for ${pkgId.name}`)
        pkgAppContainer.use(`/${pkgId.name}/`, pkgApp)
      }
    })
    return new Promise<void>((resolve, reject) => {
      console.info(`HTTP: starting server on port ${env.port}`)
      server = app.listen(env.port, (...args: any[]) => (args[0] ? reject(args[0]) : resolve()))
      shutdownGracefully = gracefulShutdown(server, {
        development: false,
        forceExit: false,
        timeout: 1000,
      })
      console.info(`HTTP: listening on port ${env.port} :)`)
    })
  }
}
