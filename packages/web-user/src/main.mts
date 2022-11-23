import { connectPkg } from '@moodlenet/core'
import apis from './apis.mjs'
import { WebPkgDeps } from './ui.mjs'
import { reactAppPkg } from './use-pkg-apis.mjs'

export * from './types.mjs'

const connection = await connectPkg(import.meta, { apis })

await reactAppPkg.api('plugin')<WebPkgDeps>({
  mainComponentLoc: ['src', 'webapp', 'MainComponent.js'],
  usesPkgs: [connection],
})

export default connection
