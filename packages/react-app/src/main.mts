import authConn from '@moodlenet/authentication-manager'
import graphConn from '@moodlenet/content-graph'
import { connectPkg } from '@moodlenet/core'
import organizationConn from '@moodlenet/organization'
import apis from './apis.mjs'
import { setupPlugin } from './lib.mjs'

export * from './types.mjs'

// import { fileURLToPath } from 'url'
// const __dirname = fileURLToPath(new URL('.', import.meta.url))
// export * from './pub-lib.mjs'
// export * from './types.mjs'

const reactAppConn = await connectPkg(import.meta, { apis })
export default reactAppConn

export type WebPkgDeps = [
  typeof reactAppConn,
  typeof organizationConn,
  typeof authConn,
  typeof graphConn,
]

const WebPkgDeps: WebPkgDeps = [reactAppConn, organizationConn, authConn, graphConn]
await setupPlugin<WebPkgDeps>({
  pkgId: reactAppConn,
  pluginDef: {
    mainComponentLoc: ['lib', 'webapp', 'MainComponent.js'],
    usesPkgs: WebPkgDeps,
  },
})
