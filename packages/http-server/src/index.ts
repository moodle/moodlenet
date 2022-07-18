import type * as Core from '@moodlenet/core'
import express, { Application } from 'express'
import { Server } from 'http'
import { makeExtPortsApp } from './ext-ports-app'
import { PriMsgBaseUrl } from './types'
export * from './types'

interface Instance {
  mount(_: { mountApp: Application; absMountPath?: string }): void
  express: typeof express
}

export type MNHttpServerExt = Core.ExtDef<'moodlenet-http-server', '0.1.10', {}, void, Instance>

const ext: Core.Ext<MNHttpServerExt, [Core.CoreExt]> = {
  id: 'moodlenet-http-server@0.1.10',
  displayName: 'HTTP server',
  description: 'Client HTTP server for the frontend',
  requires: ['moodlenet-core@0.1.10'], //, 'moodlenet.sys-log@0.1.10'],
  enable(shell) {
    return {
      deploy(/* {  tearDown } */) {
        const logger = console
        // const logger = coreExt.sysLog.moodlenetSysLogLib(shell)
        const env = getEnv(shell.env)
        const app = express().use(`/`, (_, __, next) => next())

        let server: Server | undefined

        if (env.port) {
          restartServer(env.port)
        } else {
          logger.info(`No port defined in env, won't start HTTP server at startup`)
        }
        return {
          inst({ depl }) {
            return {
              mount({ mountApp, absMountPath }) {
                const { extName /* , version */ } = shell.lib.splitExtId(depl.extId)
                const mountPath = absMountPath ?? `/_/${extName}`
                console.log('MOUNT', { extName, mountPath, absMountPath })
                app.use(mountPath, mountApp)
              },
              express,
              // xlib,
            }
          },
        }

        async function stopServer() {
          return new Promise<void>((resolve, reject) => {
            if (!server) {
              return resolve()
            }
            logger.info(`Stopping HTTP server`)
            server.close(err => (err ? reject(err) : resolve()))
          })
        }
        async function restartServer(port: number) {
          await stopServer()
          return new Promise<void>((resolve, reject) => {
            logger.info(`Starting HTTP server on port ${port}`)
            server = app.listen(port, function () {
              arguments[0] ? reject(arguments[0]) : resolve()
            })
            const extPortsApp = makeExtPortsApp(shell)
            const basePriMsgUrl: PriMsgBaseUrl = '/_/_'
            app.use(basePriMsgUrl, extPortsApp)
            logger.info(`HTTP listening on port ${port} :)`)
          })
        }
      },
    }
  },
}
export default { exts: [ext] }

type Env = {
  port: number
}
function getEnv(rawExtEnv: Core.RawExtEnv): Env {
  const env: Env = {
    port: 8080,
    ...rawExtEnv,
  }
  console.log({ httpServerEnv: env })
  //FIXME: implement checks ?
  return env
}
