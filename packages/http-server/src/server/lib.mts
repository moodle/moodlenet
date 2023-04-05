import { instanceDomain } from '@moodlenet/core'
import { RequestHandler } from 'express'
import { shell } from './shell.mjs'
import type { HttpAsyncCtx, MiddlewareItem, MountAppItem } from './types.mjs'
export * from './types.mjs'

export const mountedApps: MountAppItem[] = []
export const middlewares: MiddlewareItem[] = []

export async function mountApp(mountItem: Pick<MountAppItem, 'getApp' | 'mountOnAbsPath'>) {
  const { pkgId: callerPkgId } = shell.assertCallInitiator()
  console.log(`HTTP: register mountApp for ${callerPkgId.name}`)
  mountedApps.push({ ...mountItem, pkgId: callerPkgId })
  const baseUrl = `${instanceDomain}/.pkg${mountItem.mountOnAbsPath ?? `/${callerPkgId.name}`}`
  return {
    baseUrl,
  }
}

export async function addMiddlewares(mwItem: Pick<MiddlewareItem, 'handlers'>) {
  const { pkgId: callerPkgId } = shell.assertCallInitiator()
  console.log(`HTTP: register Middleware for ${callerPkgId.name}`)
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
  shell.initiateCall(() => {
    shell.myAsyncCtx.set(() => ({
      currentHttp: {
        request,
        response,
      },
    }))
    next()
  })
}
