import { connectPkg } from '@moodlenet/core'
import apis from './apis.mjs'
import './init.mjs'
import { reactAppPkgApis } from './use-pkg-apis.mjs'
import { MyUsesPkgs } from './webapp/types.mjs'

export * from './types.mjs'

const connection = await connectPkg(import.meta, apis)
export default connection

const MyUsesPkgs: MyUsesPkgs = [connection]
await reactAppPkgApis('plugin')({
  mainComponentLoc: ['lib', 'webapp', 'MainComponent.js'],
  usesPkgs: MyUsesPkgs,
})
