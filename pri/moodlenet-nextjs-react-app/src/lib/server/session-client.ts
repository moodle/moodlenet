import { http_bind } from '@moodle/bindings-http'
import { generateUlid } from '@moodle/lib-id-gen'
import { any_, url_string_schema } from '@moodle/lib-types'
import i18next from 'i18next'
import { headers } from 'next/headers'
// import { isAdminUserSession, isAuthenticatedUserSession } from '@moodle/module/user-account/lib'
import { gateProvider } from '@moodle/domain/gate'
import { gateClient, gateClientProxy } from '@moodle/domain/lib'
import { redirect, RedirectType } from 'next/navigation'
import { hasher } from 'node-object-hash'
import assert from 'node:assert'
import { appRoute, appRoutes } from '../common/appRoutes'
import { getAuthTokenCookie } from './auth'
const MOODLE_NET_REACT_APP_PRIMARY_ENDPOINT_URL = process.env.MOODLE_NET_REACT_APP_PRIMARY_ENDPOINT_URL

const reqHttpTarget = MOODLE_NET_REACT_APP_PRIMARY_ENDPOINT_URL ?? 'http://localhost:8000'
const httpGateDispatcher = http_bind.getHttpBinderDispatcher<moo.def.gate.provider.request>({ reqHttpTarget })

const session = {
  get client() {
    return _sessionClient()
  },
}

export default session

export type sessionClient = {
  dispatcher: moo.def.gate.client.dispatcher
  proxy: moo.def.gate.client.proxy
  policiesInfo: Promise<moo.def.policies.user.info>
  gate: Promise<moo.def.gate.client>
}

const request_session_async_storage = new AsyncLocalStorage<sessionClient>()
function _sessionClient() {
  const _existing_current_session_client = request_session_async_storage.getStore()
  if (_existing_current_session_client) {
    return _existing_current_session_client
  }
  const requestClaimsPromise = getClaims()

  const cache = new Map<string, any_>()
  const { hash } = hasher({
    coerce: false,
    alg: 'sha1',
    enc: 'hex',
    // NOTE : see, this kind of cache can become tricky because of sorting:
    // it's good in general but for certain cases, it can be a problem
    // maybe primary & _domainAccess could have a flag to disable
    // moreover, cache should be enabled for query endpoints only
    // but atm we have query|write channel discrimination in secondary only
    sort: true,
  })

  const proxy = gateClientProxy({ gateClientDispatcher })

  const policiesInfoPromise = proxy.any.accessControl.policies.readMyOwn.policiesInfo().then(({ policiesInfo }) => policiesInfo)
  let gatePromise: sessionClient['gate']

  const sessionClient: sessionClient = {
    dispatcher: gateClientDispatcher,
    proxy,
    policiesInfo: policiesInfoPromise,
    get gate() {
      if (!gatePromise) {
        gatePromise = policiesInfoPromise.then(policiesInfo =>
          gateClient({
            policiesInfo,
            gateProvider,
            gateClientDispatcher,
          }),
        )
      }
      return gatePromise
    },
  }
  request_session_async_storage.enterWith(sessionClient)

  return sessionClient
  function gateClientDispatcher(gateClientRequest: moo.def.gate.client.request) {
    const gateClientRequestHashingObject = { gateClientRequest }
    const gateClientRequestHash = hash(gateClientRequestHashingObject)
    // console.log(cache.has(domainMsgHash) ? `${domainMsgHash}**cache**  ` : '--fetch--  ', domainMsg.endpoint.join('.'))
    if (!cache.has(gateClientRequestHash)) {
      cache.set(
        gateClientRequestHash,
        requestClaimsPromise.then(requestClaims => {
          const gateProviderRequest: moo.def.gate.provider.request = { ...gateClientRequest, info: { claims: requestClaims } }
          return httpGateDispatcher(gateProviderRequest)
        }),
        // .catch(error => {???
        //   if (isErrorXxx(error)) {
        //     if (error.errorXxx.desc === 'Forbidden') {
        //       forbidden()
        //     }
        //     if (error.errorXxx.desc === 'Unauthorized') {
        //       unauthorized()
        //     }
        //     if (error.errorXxx.desc === 'Not Found') {
        //       notFound()
        //     }
        //   }
        //   throw error
        // }),
      )
    }

    return cache.get(gateClientRequestHash)
  }

  // FIXME:
  // The following block should refresh the session token before it expires
  // we need to fast-check-no-validation for expiration (jose.decodeJwt() ),
  // if the token is about to expire, validate token, if valid generate new and set cookie.
  // however we can't set the cookie here :
  // [Error]: Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#cookiessetname-value-options
  //
  // if (userSession.sessionToken) {
  //   const [valid, info] = userAccount.noValidationParseUserSessionToken(
  //     userSession.sessionToken,
  //   )
  //   if (valid && !info.expired && info.expires.inSecs < 5 * 60) {
  //     !! VALIDATE IT BEFORE REFRESHING !!
  //     ap.mod.secondary.userAccount_lib.session
  //       .generateSession({ userAccountId: info.userData.id })
  //       .then(([generated, session]) => {
  //         if (!generated) {
  //           return
  //         }
  //         setAuthTokenCookie(session)
  //       })
  //   }
  // }
}

export async function getCurrentUrl() {
  const currentUrl = (await headers()).get('x-pathname') as appRoute
  return currentUrl
}

export async function getAuthenticatedUserSessionOrRedirectToLogin() {
  const permissionsInfo = await session.client.policiesInfo
  if (permissionsInfo.user.type === 'auth') {
    return permissionsInfo
  }

  const loginUrl = appRoutes('/login', {
    q: {
      redirect: await getCurrentUrl(),
    },
  })
  redirect(loginUrl, RedirectType.replace)
}

export async function getAdminUserSessionOrRedirect(path = '/') {
  const authenticatedUserSession = await getAuthenticatedUserSessionOrRedirectToLogin()
  const permissionsInfo = await session.client.policiesInfo
  if (!permissionsInfo.tree.admin) {
    redirect(path)
  }
  return authenticatedUserSession
}

async function getClaims() {
  //FIXME: why is it here inside ?
  i18next.init({
    // ns: ['common', 'moduleA'],
    // defaultNS: 'moduleA',
    returnEmptyString: false,
  })

  const _headers = await headers()

  const xProto = _headers.get('x-proto')
  const xHost = _headers.get('x-host')
  const xPathname = _headers.get('x-pathname')
  const xPort = _headers.get('x-port')
  const _href = `${xProto}://${xHost}:${xPort}${xPathname}`
  assert(xHost, 'x-host not found in headers')

  // const xPort = _headers.get('x-port')
  // const xProto = _headers.get('x-proto') ?? 'http'
  // const xUrl = _headers.get('x-url') ?? undefined
  // const xMode = _headers.get('x-mode') ?? undefined
  const ua = _headers.get('x-user-agent')

  const { data: href } = url_string_schema.safeParse(_href)
  assert(href, 'x-href not found in headers')
  const requestId = generateUlid({ onDate: new Date().toISOString() })
  const authSessionToken = (await getAuthTokenCookie()).sessionToken
  const meta = {
    app: 'moodlenet NextJs Webapp@0.1',
  }
  const claims: moo.def.gate.provider.request.claims = {
    server: {
      authSessionToken,
      href,
      requestId,
      ua,
      meta,
    },
  }
  return claims
}
