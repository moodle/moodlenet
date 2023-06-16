import { instanceDomain } from '@moodlenet/core'
import type { RequestHandler } from 'express'
import { shell } from './shell.mjs'
import type { HttpAsyncCtx, MiddlewareItem, MountAppItem } from './types.mjs'
export * from './types.mjs'

export const mountedApps: MountAppItem[] = []
const middlewares: MiddlewareItem[] = []

export function getMiddlewares() {
  return [httpContextMW, ...middlewares.map(({ handlers }) => handlers).flat()]
}

export async function mountApp(mountItem: Pick<MountAppItem, 'getApp' | 'mountOnAbsPath'>) {
  const { pkgId: callerPkgId } = shell.assertCallInitiator()
  shell.log('info', `register mountApp for ${callerPkgId.name}`)
  mountedApps.push({ ...mountItem, pkgId: callerPkgId })
  const baseUrl = `${instanceDomain}${mountItem.mountOnAbsPath ?? `/.pkg/${callerPkgId.name}`}`
  return {
    baseUrl,
  }
}

export async function addMiddlewares(mwItem: Pick<MiddlewareItem, 'handlers'>) {
  const { pkgId: callerPkgId } = shell.assertCallInitiator()
  shell.log('info', `register Middleware for ${callerPkgId.name}`)
  middlewares.push({ ...mwItem, pkgId: callerPkgId })
}

export function getCurrentHttpCtx(): undefined | HttpAsyncCtx['currentHttp'] {
  const ctx = shell.myAsyncCtx.get()
  return (
    ctx && {
      ...ctx.currentHttp,
    }
  )
}

export const httpContextMW: RequestHandler = (request, response, next) => {
  shell.initiateCall(async () => {
    shell.myAsyncCtx.set(() => ({
      currentHttp: {
        request,
        response,
      },
    }))
    next()
  })
}
