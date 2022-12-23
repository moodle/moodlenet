import '../common/index.mjs'
import authConn from '../../../authentication-manager/dist/init.mjs'
import graphConn from '../../../content-graph/dist/init.mjs'
import coreConn from '@moodlenet/core'
import organizationConn from '../../../organization/dist/init.mjs'
import { setupPlugin } from './lib.mjs'
import { MyPkgContext } from '../common/my-webapp/types.mjs'
import { httpSrvPkg, kvStore } from './use-pkgs.mjs'
import { defaultAppearanceData } from '../common/index.mjs'
import myPkgId from '../root-export.mjs'
import { latestBuildFolder } from './webpack/generated-files.mjs'
import { resolve } from 'path'

if (!(await kvStore.get('appearanceData', '')).value) {
  await kvStore.set('appearanceData', '', defaultAppearanceData)
}

await setupPlugin<MyPkgContext>({
  pkgId: myPkgId,
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

httpSrvPkg.api('mount')({
  getApp(express) {
    const mountApp = express()
    const staticWebApp = express.static(latestBuildFolder, { index: './index.html' })
    mountApp.use(staticWebApp)
    mountApp.get(`*`, (req, res, next) => {
      if (req.url.startsWith('/.')) {
        next()
        return
      }
      res.sendFile(resolve(latestBuildFolder, 'index.html'))
    })
    return mountApp
  },
  mountOnAbsPath: '/',
})
