import { ensureDocumentCollection, getMyDB } from '@moodlenet/arangodb/server'
import { addMiddlewares } from '@moodlenet/http-server/server'
import { plugin } from '@moodlenet/react-app/server'
import {
  ANON_SYSTEM_USER,
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
import {
  PROFILE_HOME_PAGE_ROUTE_PATH,
  WEB_USER_SESSION_TOKEN_COOKIE_NAME,
} from '../common/exports.mjs'
import { MyWebAppDeps } from '../common/my-webapp/types.mjs'
import { expose as myExpose } from './expose.mjs'
import { shell } from './shell.mjs'
import { WebUserDataType, WebUserProfileDataType } from './types.mjs'
import {
  sendWebUserTokenCookie,
  setCurrentUnverifiedJwtToken,
  verifyCurrentTokenCtx,
} from './web-user-auth-lib.mjs'

export const env = getEnv()

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
    const homepagePath = `SUBSTITUTE( "/${PROFILE_HOME_PAGE_ROUTE_PATH}" , ":key" , ${entityDocVar}._key )`
    return `{ 
      iconUrl: '', 
      name: ${entityDocVar}.displayName, 
      homepagePath: ${homepagePath}
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
  },
})

await shell.call(addMiddlewares)({
  handlers: [
    async (req, _resp, next) => {
      const enteringToken = req.cookies[WEB_USER_SESSION_TOKEN_COOKIE_NAME]

      if ('string' !== typeof enteringToken) {
        return next()
      }

      await setCurrentUnverifiedJwtToken(enteringToken)
      await setCurrentUserFetch(async () => {
        const verifyResult = await verifyCurrentTokenCtx()
        if (!verifyResult) {
          //assert(verifyResult, `enteringToken cookie verification failed for fetching current user`)
          sendWebUserTokenCookie(undefined)
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

      next()
    },
  ],
})

type Env = {
  noWebappServer: boolean
}
function getEnv(): Env {
  const config = shell.config
  //FIXME: validate configs
  const env: Env = {
    noWebappServer: false,
    ...config,
  }

  return env
}
