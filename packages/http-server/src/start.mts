import cookieParser from 'cookie-parser'
import express from 'express'
import gracefulShutdown from 'http-graceful-shutdown'
import { makeExtPortsApp } from './ext-ports-app/make.mjs'
import {
  BASE_APIS_URL,
  BASE_PKG_MOUNT_URL,
  SESSION_TOKEN_COOKIE_NAME,
} from './ext-ports-app/pub-lib.mjs'
import { env } from './env.mjs'
import { mountedApps } from './init.mjs'

const extPortsApp = makeExtPortsApp()
export let shutdownGracefullyLocalServer: () => Promise<void>

process.on('SIGTERM', () => shutdownGracefullyLocalServer())
const app = express()
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
    app.use(mountOnAbsPath, pkgApp)
  } else {
    const pkgBaseRoute = `/${pkgId.name}`
    console.log(`HTTP: mounting ${BASE_PKG_MOUNT_URL}/${pkgBaseRoute}/ for ${pkgId.name}`)
    pkgAppContainer.use(pkgBaseRoute, pkgApp)
  }
})
await new Promise<void>((resolve, reject) => {
  console.info(`HTTP: starting server on port ${env.port}`)
  const server = app.listen(env.port, (...args: any[]) => (args[0] ? reject(args[0]) : resolve()))
  shutdownGracefullyLocalServer = gracefulShutdown(server, {
    development: false,
    forceExit: false,
    timeout: 1000,
  })
  console.info(`HTTP: listening on port ${env.port} :)`)
})
