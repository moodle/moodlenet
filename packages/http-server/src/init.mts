import type { MountAppItem } from './types.mjs'
import { connectPkg } from '@moodlenet/core'
import apis from './apis.mjs'

// export * from './ext-ports-app/pub-lib.mjs'
export * from './types.mjs'

const connection = await connectPkg(import.meta, { apis })
export default connection

export const mountedApps: MountAppItem[] = []

export async function mountApp(mountItem: MountAppItem) {
  console.log(`HTTP: register mountApp for ${mountItem.pkgId.name}`)
  mountedApps.push(mountItem)
}
