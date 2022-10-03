import { connectPkg } from '@moodlenet/core'
import apis from './apis.mjs'
import { reactAppPkgApis } from './use-pkg-apis.mjs'
import { WebPkgDeps } from './webapp/types.mjs'

export * from './types.mjs'

const connection = await connectPkg(import.meta, apis)
export default connection

const WebPkgDeps: WebPkgDeps = [connection]
await reactAppPkgApis('plugin')({
  mainComponentLoc: ['lib', 'webapp', 'MainComponent.js'],
  usesPkgs: WebPkgDeps,
})
