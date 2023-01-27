import { ensureCollections } from '@moodlenet/arangodb'
import { expose as authExpose } from '@moodlenet/authentication-manager'
import { ensureGlyphs } from '@moodlenet/content-graph'
import { mountApp } from '@moodlenet/http-server'
import { expose as orgExpose } from '@moodlenet/organization'
import { resolve } from 'path'
import '../common/exports.mjs'
import { defaultAppearanceData } from '../common/exports.mjs'
import { MyWebAppDeps } from '../common/my-webapp/types.mjs'
import { expose as myExpose } from './expose.mjs'
import kvStore from './kvStore.mjs'
import { setupPlugin } from './lib.mjs'
import shell from './shell.mjs'
import { WebUserGlyphDefMap } from './types.mjs'
import { latestBuildFolder } from './webpack/generated-files.mjs'

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

export const glyphDescriptors = await shell.call(ensureGlyphs)<WebUserGlyphDefMap>({
  defs: { Profile: { collection: { kind: 'node' } } },
})

await shell.call(ensureCollections)({ defs: { User: { kind: 'node' } } })
