import type * as Core from '@moodlenet/core'
import express, { Application } from 'express'
import { createHttpServer } from './http-server'
import { MountAppItem } from './types'
export * from './types'

interface Instance {
  mount(_: { getApp(): Application; absMountPath?: string }): void
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
        const env = getEnv(shell.env)
        const httpServer = createHttpServer({ port: env.port, shell })

        return {
          inst({ depl }) {
            return {
              mount({ getApp, absMountPath }) {
                const { extName /* , version */ } = shell.lib.splitExtId(depl.extId)
                const mountPath = absMountPath ?? `/_/${extName}`
                console.log('MOUNT', { extName, mountPath, absMountPath })
                const mountAppItem: MountAppItem = { mountPath, getApp }
                const unmount = httpServer.mountApp(mountAppItem)
                depl.tearDown.add(() => {
                  unmount()
                })
              },
              express,
              // xlib,
            }
          },
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
