import { ensureDocumentCollection, getMyDB } from '@moodlenet/arangodb/server'
import { addMiddlewares } from '@moodlenet/http-server/server'
import { plugin } from '@moodlenet/react-app/server'
import fileStoreFactory from '@moodlenet/simple-file-store/server'
import type { EntityCollectionDef, EntityUser } from '@moodlenet/system-entities/server'
import {
  ANON_SYSTEM_USER,
  isCurrentOfEntityClass2Aql,
  isCurrentUserEntity,
  isSameClass,
  registerAccessController,
  registerEntities,
  registerEntityInfoProvider,
  ROOT_SYSTEM_USER,
  setCurrentUserFetch,
} from '@moodlenet/system-entities/server'
import type { WebUserEntityNames } from '../common/exports.mjs'
import {
  PROFILE_HOME_PAGE_ROUTE_PATH,
  WEB_USER_SESSION_TOKEN_COOKIE_NAME,
} from '../common/exports.mjs'
import type { MyWebAppDeps } from '../common/my-webapp/types.mjs'
import { expose as myExpose } from './expose.mjs'
import { shell } from './shell.mjs'
import type { ProfileDataType, WebUserDataType } from './types.mjs'
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

export const { Profile } = await shell.call(registerEntities)<
  {
    Profile: EntityCollectionDef<ProfileDataType>
  },
  WebUserEntityNames
>({
  Profile: {},
})

registerEntityInfoProvider({
  entityClass: Profile.entityClass,
  aqlProvider(entityDocVar) {
    const homepagePath = `SUBSTITUTE( "${PROFILE_HOME_PAGE_ROUTE_PATH}" , ":key" , ${entityDocVar}._key )`
    return `{ 
      iconUrl: ${publicFilesHttp.getFileUrlAql({
        directAccessIdVar: `${entityDocVar}.avatarImage.directAccessId`,
      })}, 
      name: ${entityDocVar}.displayName, 
      homepagePath: ${homepagePath}
    }`
  },
})

await shell.call(registerAccessController)({
  u() {
    return `(${isCurrentOfEntityClass2Aql(
      Profile.entityClass,
    )} && ${isCurrentUserEntity()}) || null`
  },
  r(/* { myPkgMeta } */) {
    return `${isCurrentOfEntityClass2Aql(Profile.entityClass)} || null` // && ${myPkgMeta}.xx == null`
  },
  c(entityClass) {
    if (!isSameClass(Profile.entityClass, entityClass)) {
      return
    }
    // FIXME: WHAT TO CHECK ?
    return true
  },
})

await shell.call(plugin)<MyWebAppDeps>({
  initModuleLoc: ['dist', 'webapp', 'exports', 'init.js'],
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
            entityClass: Profile.entityClass,
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

export const publicFiles = await fileStoreFactory(shell, 'public')
export const publicFilesHttp = await publicFiles.mountStaticHttpServer('public')

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
