import { ensureDocumentCollection, getMyDB } from '@moodlenet/arangodb/server'
import { addMiddleware, mountApp } from '@moodlenet/http-server/server'
import kvStoreFactory from '@moodlenet/key-value-store/server'
import { expose as orgExpose } from '@moodlenet/organization/server'
import {
  EntityCollectionDef,
  EntityUser,
  isSameClass,
  registerAccessController,
  registerEntities,
  registerEntityInfoProvider,
  ROOT_SYSTEM_USER,
  setCurrentUserFetch,
} from '@moodlenet/system-entities/server'
import { isCurrentUserEntity, isEntityClass } from '@moodlenet/system-entities/server/aql-ac'
import assert from 'assert'
import { resolve } from 'path'
import {
  defaultAppearanceData,
  PROFILE_HOME_PAGE_ROUTE_PATH,
  WEB_USER_SESSION_TOKEN_COOKIE_NAME,
} from '../common/exports.mjs'
import { MyWebAppDeps } from '../common/my-webapp/types.mjs'
import { expose as myExpose } from './expose.mjs'
import { getWebappUrl, plugin } from './lib.mjs'
import { shell } from './shell.mjs'
import { KeyValueData, WebUserDataType, WebUserProfileDataType } from './types.mjs'
import { setCurrentUnverifiedJwtToken, verifyCurrentTokenCtx } from './web-user-auth-lib.mjs'
import { latestBuildFolder } from './webpack/generated-files.mjs'

export const env = getEnv()

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

registerEntityInfoProvider({
  entityClass: WebUserProfile.entityClass,
  aqlProvider(entityDocVar) {
    const baseHomePagegetWebappUrl = getWebappUrl(PROFILE_HOME_PAGE_ROUTE_PATH)
    const homepage = `SUBSTITUTE( "${baseHomePagegetWebappUrl}" , ":key" , ${entityDocVar}._key )`
    // const homepagepath =
    // const homepage = `CONCAT( "${instanceDomain}" , ${homepagepath} )`
    return `{ 
      icon: '##', 
      name: ${entityDocVar}.displayName, 
      homepage: ${homepage}
    }`
  },
})

await shell.call(registerAccessController)({
  u() {
    return `(${isEntityClass(WebUserProfile.entityClass)} && ${isCurrentUserEntity()}) || null`
  },
  r(/* { myPkgMeta } */) {
    return `${isEntityClass(WebUserProfile.entityClass)} || null` // && ${myPkgMeta}.xx == null`
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
        const verifyResult = await verifyCurrentTokenCtx()
        assert(verifyResult, `enteringToken cookie verification failed for fetching current user`)
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

      next()
    },
  ],
})

export const httpApp = await shell.call(mountApp)({
  getApp(express) {
    if (env.noWebappServer) {
      return
    }
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

type Env = {
  noWebappServer?: boolean
}
function getEnv(): Env {
  const config = shell.config ?? {}
  //FIXME: validate configs
  const env: Env = config
  return env
}
