import { env } from './env.mjs'
import shell from './shell.mjs'
import type { MountAppItem } from './types.mjs'
export * from './types.mjs'

export const mountedApps: MountAppItem[] = []

export async function mountApp(mountItem: Pick<MountAppItem, 'getApp' | 'mountOnAbsPath'>) {
  const { pkgId: callerPkgId } = shell.assertCallInitiator()
  console.log(`HTTP: register mountApp for ${callerPkgId.name}`)
  mountedApps.push({ ...mountItem, pkgId: callerPkgId })
}

export async function getHttpBaseUrl() {
  return `${env.domain.protocol}://${env.domain.name}`
}
