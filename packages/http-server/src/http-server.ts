import type { Shell } from '@moodlenet/core'
import express, { Application } from 'express'
import type { Server } from 'http'
import gracefulShutdown from 'http-graceful-shutdown'
import type { MNHttpServerExt, MountAppItem, PriMsgBaseUrl } from '.'
import { makeExtPortsApp } from './ext-ports-app'

type Cfg = { shell: Shell<MNHttpServerExt>; port: number }
const basePriMsgUrl: PriMsgBaseUrl = '/_/_'
export function createHttpServer({ shell, port }: Cfg) {
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
    //   })
    // })
  }
  function start() {
    app = express().use(`/`, (_, __, next) => next())
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
