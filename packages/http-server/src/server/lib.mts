import { shell } from './shell.mjs'
import type { MiddlewareItem, MountAppItem } from './types.mjs'
export * from './types.mjs'

export const mountedApps: MountAppItem[] = []
export const middlewares: MiddlewareItem[] = []

export async function mountApp(mountItem: Pick<MountAppItem, 'getApp' | 'mountOnAbsPath'>) {
  const { pkgId: callerPkgId } = shell.assertCallInitiator()
  console.log(`HTTP: register mountApp for ${callerPkgId.name}`)
  mountedApps.push({ ...mountItem, pkgId: callerPkgId })
}

export async function addMiddlewares(mwItem: Pick<MiddlewareItem, 'handlers'>) {
  const { pkgId: callerPkgId } = shell.assertCallInitiator()
  console.log(`HTTP: register  for ${callerPkgId.name}`)
  middlewares.push({ ...mwItem, pkgId: callerPkgId })
}
