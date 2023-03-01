import {
  EntityCollectionDef,
  registerAccessController,
  registerEntities,
} from '@moodlenet/access-control/server'
import { ensureDocumentCollection, getMyDB } from '@moodlenet/arangodb/server'
import {
  expose as authExpose,
  getCurrentClientSession,
} from '@moodlenet/authentication-manager/server'
import { mountApp } from '@moodlenet/http-server/server'
import kvStoreFactory from '@moodlenet/key-value-store/server'
import { expose as orgExpose } from '@moodlenet/organization/server'
import { resolve } from 'path'
import { defaultAppearanceData } from '../common/exports.mjs'
import { MyWebAppDeps } from '../common/my-webapp/types.mjs'
import { expose as myExpose } from './expose.mjs'
import { setupPlugin } from './lib.mjs'
import { shell } from './shell.mjs'
import { KeyValueData, WebUserDataType, WebUserProfileDataType } from './types.mjs'
import { getWebUser } from './web-user-lib.mjs'
import { latestBuildFolder } from './webpack/generated-files.mjs'

export const kvStore = await kvStoreFactory<KeyValueData>(shell)
if (!(await kvStore.get('appearanceData', '')).value) {
  await kvStore.set('appearanceData', '', defaultAppearanceData)
}

export const { db } = await shell.call(getMyDB)()
export const WEB_USER_COLLECTION_NAME = 'WebUser'
export const { collection: WebUserCollection /* ,newlyCreated */ } = await shell.call(
  ensureDocumentCollection<WebUserDataType>,
)(WEB_USER_COLLECTION_NAME)

export const { WebUserProfile } = await shell.call(registerEntities)<{
  WebUserProfile: EntityCollectionDef<WebUserProfileDataType>
}>({
  WebUserProfile: {},
})

await shell.call(registerAccessController)({
  async update(doc) {
    if (!WebUserProfile.is(doc)) {
      return
    }
    const clientSession = await getCurrentClientSession()
    if (!clientSession?.user) {
      throw new Error('must be authenticated')
    }
    const webUser = await getWebUser({ userKey: clientSession?.user._key })

    if (!webUser) {
      throw new Error('cannot find user')
    }

    if (webUser.profileKey !== doc._key) {
      throw new Error('only me can update me')
    }
  },
})

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
