import { ensureDocumentCollection, getMyDB } from '@moodlenet/arangodb/server'
import { addMiddleware, mountApp } from '@moodlenet/http-server/server'
import kvStoreFactory from '@moodlenet/key-value-store/server'
import { expose as orgExpose } from '@moodlenet/organization/server'
import {
  ANON_SYSTEM_USER,
  EntityCollectionDef,
  EntityUser,
  isSameClass,
  registerAccessController,
  registerEntities,
  ROOT_SYSTEM_USER,
  setCurrentUserFetch,
} from '@moodlenet/system-entities/server'
import { isCurrentUserEntity, isEntityClass } from '@moodlenet/system-entities/server/aql-ac'
import { resolve } from 'path'
import { defaultAppearanceData, WEB_USER_SESSION_TOKEN_COOKIE_NAME } from '../common/exports.mjs'
import { MyWebAppDeps } from '../common/my-webapp/types.mjs'
import { expose as myExpose } from './expose.mjs'
import { plugin } from './lib.mjs'
import { shell } from './shell.mjs'
import { KeyValueData, WebUserDataType, WebUserProfileDataType } from './types.mjs'
import { setCurrentUnverifiedJwtToken, verifyCurrentTokenCtx } from './web-user-auth-lib.mjs'
import { latestBuildFolder } from './webpack/generated-files.mjs'

export const kvStore = await kvStoreFactory<KeyValueData>(shell)
if (!(await kvStore.get('appearanceData', '')).value) {
  await kvStore.set('appearanceData', '', defaultAppearanceData)
}

export const { db } = await shell.call(getMyDB)()
export const { collection: WebUserCollection /* ,newlyCreated */ } = await shell.call(
  ensureDocumentCollection<WebUserDataType>,
)('WebUser')

export const { WebUserProfile } = await shell.call(registerEntities)<{
  WebUserProfile: EntityCollectionDef<WebUserProfileDataType>
}>({
  WebUserProfile: {},
})

await shell.call(registerAccessController)({
  u() {
    return isCurrentUserEntity()
  },
  r(/* { myPkgMeta } */) {
    return `${isEntityClass(WebUserProfile.entityClass)}` // && ${myPkgMeta}.xx == null`
  },
  c(entityClass) {
    if (!isSameClass(WebUserProfile.entityClass, entityClass)) {
      return
    }
    // FIXME: WHAT TO CHECK ?
    return true
  },
})

await shell.call(plugin)<MyWebAppDeps>({
  mainComponentLoc: ['dist', 'webapp', 'MainComponent.js'],
  deps: {
    me: myExpose,
    organization: orgExpose,
  },
})

await shell.call(addMiddleware)({
  handlers: [
    async (req, _resp, next) => {
      const enteringToken = req.cookies[WEB_USER_SESSION_TOKEN_COOKIE_NAME]

      if ('string' !== typeof enteringToken) {
        return next()
      }
      await setCurrentUnverifiedJwtToken(enteringToken)
      await setCurrentUserFetch(async () => {
        if (!enteringToken) {
          return ANON_SYSTEM_USER
        }
        const verifyResult = await verifyCurrentTokenCtx()
        if (!verifyResult) {
          // CHECK: shoud throw 401 or some other error ?
          return ANON_SYSTEM_USER
        }
        const { currentWebUser } = verifyResult
        if (currentWebUser.isRoot) {
          return ROOT_SYSTEM_USER
        }
        const entityUser: EntityUser = {
          type: 'entity',
          entityIdentifier: {
            entityClass: WebUserProfile.entityClass,
            _key: currentWebUser.profileKey,
          },
          restrictToScopes: false,
        }
        return entityUser
      })
      // console.log('out token set')

      next()
    },
  ],
})
await shell.call(mountApp)({
  getApp(express) {
    const mountApp = express()
    const staticWebApp = express.static(latestBuildFolder, { index: './index.html' })
    mountApp.use(staticWebApp)
    //cookieParser(secret?: string | string[] | undefined, options?: cookieParser.CookieParseOptions | undefined)
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
