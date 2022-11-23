import '../common/index.mjs'
import authConn from '@moodlenet/authentication-manager'
import graphConn from '@moodlenet/content-graph'
import coreConn from '@moodlenet/core'
import { connectPkg } from '@moodlenet/core'
import organizationConn from '@moodlenet/organization'
import apis from './apis.mjs'
import { WebPkgDeps } from '../common/types.mjs'
import { setupPlugin } from './lib.mjs'

// import { fileURLToPath } from 'url'
// const __dirname = fileURLToPath(new URL('.', import.meta.url))
// export * from './pub-lib.mjs'
// export * from './types.mjs'

const reactAppConn = await connectPkg(import.meta, { apis })
export default reactAppConn

const webPkgDeps: WebPkgDeps = [reactAppConn, organizationConn, authConn, graphConn, coreConn]
await setupPlugin<WebPkgDeps>({
  pkgId: reactAppConn,
  pluginDef: {
    mainComponentLoc: ['src', 'webapp', 'MainComponent.js'],
    usesPkgs: webPkgDeps,
  },
})
