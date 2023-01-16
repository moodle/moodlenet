import '../common/exports.mjs'
import { setupPlugin } from './lib.mjs'
import { expose as authExpose } from '@moodlenet/authentication-manager'
import { expose as graphExpose } from '@moodlenet/content-graph'
import { expose as orgExpose } from '@moodlenet/organization'
import { mountApp } from '@moodlenet/http-server'
import { MyWebAppDeps } from '../common/my-webapp/types.mjs'
import kvStore from './kvStore.mjs'
import { defaultAppearanceData } from '../common/exports.mjs'
import { latestBuildFolder } from './webpack/generated-files.mjs'
import { resolve } from 'path'
import { expose as myExpose } from './expose.mjs'
import shell from './shell.mjs'

if (!(await kvStore.get('appearanceData', '')).value) {
  await kvStore.set('appearanceData', '', defaultAppearanceData)
}

await setupPlugin<MyWebAppDeps>({
  pkgId: shell.myId,
  pluginDef: {
    mainComponentLoc: ['dist', 'webapp', 'MainComponent.js'],
    deps: {
      me: myExpose,
      organization: orgExpose,
      graph: graphExpose,
      auth: authExpose,
    },
  },
})

await shell.call(mountApp)({
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
