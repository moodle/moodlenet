import { connectPkg } from '@moodlenet/core'
import apis from './apis.mjs'
import { reactAppPkg } from './use-pkg-apis.mjs'
import { WebPkgDeps } from './webapp/types.mjs'

export * from './types.mjs'

const connection = await connectPkg(import.meta, { apis })
export default connection

const WebPkgDeps: WebPkgDeps = [connection]
await reactAppPkg.api('plugin')({
  mainComponentLoc: ['src', 'webapp', 'MainComponent.js'],
  usesPkgs: WebPkgDeps,
})
