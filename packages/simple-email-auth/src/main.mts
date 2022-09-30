import { connectPkg } from '@moodlenet/core'
import apis from './apis.mjs'
import { reactAppPkgApis } from './use-pkg-apis.mjs'
import { WebPkgDeps } from './webapp/types.mjs'

export * from './types.mjs'

const connection = await connectPkg(import.meta, apis)
export default connection

reactAppPkgApis('plugin')<WebPkgDeps>({
  mainComponentLoc: ['lib', 'webapp', 'MainComponent.js'],
  usesPkgs: [connection],
})
