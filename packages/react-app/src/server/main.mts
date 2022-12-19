import '../common/index.mjs'
import authConn from '@moodlenet/authentication-manager'
import graphConn from '@moodlenet/content-graph'
import coreConn from '@moodlenet/core'
import { connectPkg } from '@moodlenet/core'
import organizationConn from '@moodlenet/organization'
import apis from './apis.mjs'
import { setupPlugin } from './lib.mjs'
import { MyPkgContext } from '../common/my-webapp/types.mjs'

// import { fileURLToPath } from 'url'
// const __dirname = fileURLToPath(new URL('.', import.meta.url))
// export * from './pub-lib.mjs'
// export * from './types.mjs'

const reactAppConn = await connectPkg(import.meta, { apis })
export default reactAppConn

await setupPlugin<MyPkgContext>({
  pkgId: reactAppConn,
  pluginDef: {
    mainComponentLoc: ['dist', 'webapp', 'MainComponent.js'],
    usesPkgs: {
      auth: authConn,
      graph: graphConn,
      organization: organizationConn,
      core: coreConn,
    },
  },
})
