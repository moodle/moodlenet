import type * as Core from '@moodlenet/core'
import express, { Application } from 'express'
import { createHttpServer } from './http-server'
import { MountAppItem } from './types'
export * from './types'

interface Plug {
  mount(_: { getApp(): Application; absMountPath?: string }): void
  express: typeof express
}

export type MNHttpServerExt = Core.ExtDef<'@moodlenet/http-server', '0.1.0', {}, void, Plug>

const ext: Core.Ext<MNHttpServerExt, [Core.CoreExt]> = {
  name: '@moodlenet/http-server',
  version: '0.1.0',
  requires: ['@moodlenet/core@0.1.0'], //, '@moodlenet/sys-log@0.1.0'],
  wireup(shell) {
    return {
      deploy(/* {  tearDown } */) {
        const env = getEnv(shell.env)
        const httpServer = createHttpServer({ port: env.port, shell })

        return {
          plug({ depl }) {
            return {
              mount({ getApp, absMountPath }) {
                const { extName /* , version */ } = shell.lib.splitExtId(depl.shell.extId)
                const mountPath = absMountPath ?? `/_/${extName}`
                console.log('MOUNT', { extName, mountPath, absMountPath })
                const mountAppItem: MountAppItem = { mountPath, getApp }
                const unmount = httpServer.mountApp(mountAppItem)
                depl.shell.tearDown.add(() => {
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
export default ext

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
