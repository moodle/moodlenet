import type { AuthenticationManagerExt } from '@moodlenet/authentication-manager'
import type * as Core from '@moodlenet/core'
import express, { Application } from 'express'
import { createHttpServer } from './http-server'
import { MountAppItem } from './types'
export * from './types'

interface Plug {
  mount(_: { getApp(): Application; absMountPath?: string }): void
  express: typeof express
}

export type MNHttpServerExtDef = Core.ExtDef<'@moodlenet/http-server', '0.1.0', Plug, {}>
export type MNHttpServerExt = Core.Ext<MNHttpServerExtDef, [Core.CoreExt, AuthenticationManagerExt]>

const ext: MNHttpServerExt = {
  name: '@moodlenet/http-server',
  version: '0.1.0',
  requires: ['@moodlenet/core@0.1.0', '@moodlenet/authentication-manager@0.1.0'], //, '@moodlenet/sys-log@0.1.0'],
  connect(shell) {
    return {
      deploy() {
        const env = getEnv(shell.env)
        const httpServer = createHttpServer({ port: env.port, shell })

        return {
          plug(dep) {
            return {
              mount({ getApp, absMountPath }) {
                const { extName /* , version */ } = shell.lib.splitExtId(dep.shell.extId)
                const mountPath = absMountPath ?? `/_/${extName}`
                const mountAppItem: MountAppItem = { mountPath, getApp }
                const unmount = httpServer.mountApp(mountAppItem)
                dep.shell.tearDown.add(() => {
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
  //FIXME: implement checks ?
  return env
}
