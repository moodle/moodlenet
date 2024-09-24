import cookieParser from 'cookie-parser'
import express from 'express'
import gracefulShutdown from 'http-graceful-shutdown'
import { BASE_PKG_URL } from '../common/pub-lib.mjs'
import { makeExtPortsApp } from './ext-ports-app/make.mjs'
import { env } from './init/env.mjs'
import { getMiddlewares, httpContextMW, mountedApps } from './lib.mjs'
import { shell } from './shell.mjs'

export let shutdownGracefullyLocalServer: () => Promise<void>

process.on('SIGTERM', () => shutdownGracefullyLocalServer())

if (!env.disabled) {
  const app = express()
  // BEWARE //@ALE those 2 settings below should likely be explicitely configured ( 'x-forward-*' headers ) - https://expressjs.com/en/guide/behind-proxies.html
  app.set('trust proxy', true)
  app.enable('trust proxy')

  app.use(cookieParser())
  app.use(httpContextMW)

  const pkgAppContainer = express()
  app.use(`${BASE_PKG_URL}/`, pkgAppContainer)

  const extPortsApp = makeExtPortsApp()
  app.use(`${BASE_PKG_URL}/`, extPortsApp)

  await Promise.all(
    mountedApps.map(async ({ getApp, mountOnAbsPath, pkgId }) => {
      const pkgApp = await getApp(express)
      if (!pkgApp) {
        return
      }
      if (mountOnAbsPath) {
        shell.log('info', `mounting ${mountOnAbsPath} for ${pkgId.name}`)
        app.use(mountOnAbsPath, pkgApp)
      } else {
        const pkgBaseRoute = `/${pkgId.name}`
        shell.log('info', `mounting ${BASE_PKG_URL}/${pkgBaseRoute}/ for ${pkgId.name}`)
        pkgAppContainer.use(pkgBaseRoute, ...getMiddlewares(), pkgApp)
      }
    }),
  )
  await new Promise<void>((resolve, reject) => {
    shell.log('info', `starting server on port ${env.port}`)
    const server = app.listen(env.port, (...args: any[]) => (args[0] ? reject(args[0]) : resolve()))
    server.on('error', err => shell.log('info', { 'server error': err }))
    shutdownGracefullyLocalServer = gracefulShutdown(server, {
      development: false,
      forceExit: false,
      timeout: 1000,
    })
    shell.log('info', `listening on port ${env.port} :)`)
  })
}
