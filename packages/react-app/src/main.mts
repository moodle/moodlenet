import authConn from '@moodlenet/authentication-manager'
import graphConn from '@moodlenet/content-graph'
import { connectPkg } from '@moodlenet/core'
import organizationConn from '@moodlenet/organization'
import apis from './apis.mjs'
import { setupPlugin } from './lib.mjs'
import { WebPkgDeps } from './webapp/MainContext.js'

export * from './types.mjs'

// import { fileURLToPath } from 'url'
// const __dirname = fileURLToPath(new URL('.', import.meta.url))
// export * from './pub-lib.mjs'
// export * from './types.mjs'

const pkgId = await connectPkg(import.meta, apis)
export default pkgId

const webPkgDeps: WebPkgDeps = [pkgId, organizationConn, authConn, graphConn]
await setupPlugin<WebPkgDeps>({
  pkgId,
  pluginDef: {
    mainComponentLoc: ['lib', 'webapp', 'MainComponent.js'],
    usesPkgs: webPkgDeps,
  },
})
