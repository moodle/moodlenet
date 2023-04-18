import { ensureDocumentCollection, getMyDB } from '@moodlenet/arangodb/server'
import { instanceDomain } from '@moodlenet/core'
import { addMiddlewares, mountApp } from '@moodlenet/http-server/server'
import kvStoreFactory from '@moodlenet/key-value-store/server'
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
import { readFile } from 'fs/promises'
import { resolve } from 'path'
import {
  defaultAppearanceData,
  PROFILE_HOME_PAGE_ROUTE_PATH,
  WEB_USER_SESSION_TOKEN_COOKIE_NAME,
} from '../common/exports.mjs'
import { MyWebAppDeps } from '../common/my-webapp/types.mjs'
import { expose as myExpose } from './expose.mjs'
import { plugin } from './lib.mjs'
import {
  getDefaultOpenGraphData,
  OpenGraphData,
  OpenGraphDataProvided,
  OpenGraphProviderItems,
} from './opengraph.mjs'
import { shell } from './shell.mjs'
import { KeyValueData, WebUserDataType, WebUserProfileDataType } from './types.mjs'
import {
  sendWebUserTokenCookie,
  setCurrentUnverifiedJwtToken,
  verifyCurrentTokenCtx,
} from './web-user-auth-lib.mjs'
import { latestBuildFolder } from './webpack/generated-files.mjs'

export const env = getEnv()

export const kvStore = await kvStoreFactory<KeyValueData>(shell)
if (!(await kvStore.get('appearanceData', '')).value) {
  await kvStore.set('appearanceData', '', defaultAppearanceData)
}
if (!(await kvStore.get('configs', '')).value) {
  await kvStore.set('configs', '', {
    webIconSize: [256, 256],
    webImageSize: [1000, 1000],
  })
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

export const httpApp = await shell.call(mountApp)({
  getApp(express) {
    if (env.noWebappServer) {
      return
    }
    const mountApp = express()
    const staticWebApp = express.static(latestBuildFolder, { index: false })
    mountApp.use(staticWebApp)
    //cookieParser(secret?: string | string[] | undefined, options?: cookieParser.CookieParseOptions | undefined)
    mountApp.get(`*`, async (req, res, next) => {
      if (
        req.url.startsWith('/.') ||
        // FIXME :\
        ['/service-worker.js', '/manifest.json', 'favicon.svg'].includes(req.url)
      ) {
        next()
        return
      }

      const webappPath = req.url
      let openGraphDataProvided: OpenGraphDataProvided | undefined
      for (const providerItem of OpenGraphProviderItems) {
        openGraphDataProvided = await providerItem.provider(webappPath)
        if (openGraphDataProvided) {
          break
        }
      }
      const openGraphData: OpenGraphData = {
        url: `${instanceDomain}${req.url}`,
        type: 'website',
        //FIXME: need to add image to orgData !
        image: 'https://moodle.net/moodlenet-logo.svg',
        ...(await getDefaultOpenGraphData()),
        ...openGraphDataProvided,
      }

      console.log({ webappPath, openGraphDataProvided, openGraphData })

      const _html = await readFile(resolve(latestBuildFolder, 'index.html'), 'utf-8')
      const headReplace = openGraphData
        ? `<head>
<title>${openGraphData.title}</title>
<meta name="description" content="${openGraphData.description}" />
<!-- OpenGraph -->
<meta property="og:title" content="${openGraphData.title}" />
<meta property="og:description" content="${openGraphData.description}" />
<meta property="og:image" content="${openGraphData.image}" />
<meta property="og:url" content="${openGraphData.url}">
<meta property="og:type" content="${openGraphData.type}">
<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta property="twitter:domain" content="${instanceDomain.split('//')[1]}">
<meta property="twitter:url" content="${openGraphData.url}">
<meta name="twitter:title" content="${openGraphData.title}">
<meta name="twitter:description" content="${openGraphData.description}">
<meta name="twitter:image" content="${openGraphData.image}">
`
        : `<head>
<title>MoodleNet</title>
`
      const html = _html.replace('<head>', headReplace.replace(/\n/g, ''))

      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.send(html)
    })
    return mountApp
  },
  mountOnAbsPath: '/',
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
