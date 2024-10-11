import { http_bind } from '@moodle/bindings-node'
import { moodle_domain } from '@moodle/domain'
import { access_session, create_access_proxy } from '@moodle/lib-ddd'
import { isAdminUserSession, isAuthenticatedUserSession } from '@moodle/mod-iam/lib'
import i18next from 'i18next'
import { headers } from 'next/headers'
import { redirect, RedirectType } from 'next/navigation'
import { userAgent } from 'next/server'
import assert from 'node:assert'
import { sitepaths } from '../common/utils/sitepaths'
import { getAuthTokenCookie } from './auth'
import { generateUlid } from '@moodle/lib-id-gen'

const MOODLE_NET_NEXTJS_PRIMARY_ENDPOINT_URL = process.env.MOODLE_NET_NEXTJS_PRIMARY_ENDPOINT_URL


const requestTarget = MOODLE_NET_NEXTJS_PRIMARY_ENDPOINT_URL ?? 'http://localhost:8000'

export function priAccess(): moodle_domain['primary'] {
  return _domainAccess().primary
}

function _domainAccess(): moodle_domain {
  //FIXME: _domainAccess() or priAccess() should be a singleton FOR THE CURRENT REQUEST
  // so that it doesn't create a new instance of transportClient every time
  // implying a new HTTPConnection on every priAccess()
  // a singleton could be created in the middleware and passed to the request object
  const trnspClient = http_bind.client()

  const [moodle_domain] = create_access_proxy<moodle_domain>({
    async sendDomainMsg({ domain_msg }) {
      const accessSession = await getAccessSession()
      return trnspClient(
        {
          domain_msg,
          access_session: accessSession,
          // core_mod_id: null,
        },
        requestTarget,
      )
    },
  })
  // FIXME:
  // The following block should refresh the session token before it expires
  // we need to fast-check-no-validation for expiration (jose.decodeJwt() ),
  // if the token is about to expire, validate token, if valid generate new and set cookie.
  // however we can't set the cookie here :
  // [Error]: Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#cookiessetname-value-options
  //
  // if (accessSession.sessionToken) {
  //   const [valid, info] = iam.noValidationParseUserSessionToken(
  //     accessSession.sessionToken,
  //   )
  //   if (valid && !info.expired && info.expires.inSecs < 5 * 60) {
  //     !! VALIDATE IT BEFORE REFRESHING !!
  //     ap.mod.iam_lib.session
  //       .generateSession({ userId: info.userData.id })
  //       .then(([generated, session]) => {
  //         if (!generated) {
  //           return
  //         }
  //         setAuthTokenCookie(session)
  //       })
  //   }
  // }

  return moodle_domain
}

export async function getUserSession() {
  const { userSession } = await priAccess().iam.session.getCurrentUserSession()
  return userSession
}

export async function getAuthenticatedUserSessionOrRedirectToLogin() {
  const maybe_authenticatedUserSession = await getUserSession()
  if (isAuthenticatedUserSession(maybe_authenticatedUserSession)) {
    return maybe_authenticatedUserSession
  }

  const loginUrl = sitepaths.login({
    query: {
      redirect: headers().get('x-pathname') ?? sitepaths(),
    },
  })
  redirect(loginUrl, RedirectType.replace)
}

export async function getAdminUserSessionOrRedirect(path = '/') {
  const authenticatedUserSession = await getAuthenticatedUserSessionOrRedirectToLogin()
  if (!isAdminUserSession(authenticatedUserSession)) {
    redirect('/')
  }
  return authenticatedUserSession
}

async function getAccessSession() {
  //FIXME: why is it here inside ?
  i18next.init({
    // ns: ['common', 'moduleA'],
    // defaultNS: 'moduleA',
    returnEmptyString: false,
  })

  const _headers = headers()
  const xHost = _headers.get('x-host')
  // const xPort = _headers.get('x-port')
  const xProto = _headers.get('x-proto') ?? 'http'
  const xClientIp = _headers.get('x-client-ip') ?? undefined
  const xUrl = _headers.get('x-url') ?? undefined
  const xMode = _headers.get('x-mode') ?? undefined
  const xGeo = JSON.parse(_headers.get('x-geo') ?? '{}')
  const ua = userAgent({ headers: _headers })
  assert(xHost, 'x-host not found in headers')
  const accessSession: access_session = {
    type: 'user',
    id: { type: 'primary-session', uid: await generateUlid() },
    sessionToken: getAuthTokenCookie().sessionToken,
    app: {
      name: 'moodlenetWebapp',
      version: '0.1',
    },
    protocol: {
      type: 'http',
      secure: xProto === 'https',
      mode: xMode,
      url: xUrl,
      clientIp: xClientIp,
      ua: {
        name: ua.ua,
        isBot: ua.isBot,
      },
    },
    domain: xHost,
    platforms: {
      local: {
        type: 'nodeJs',
        version: process.version,
        env: process.env,
      },
      remote: {
        type: 'browser',
        version: ua.browser.version,
        name: ua.browser.name,
        geo: xGeo,
        cpu: ua.cpu,
        device: ua.device,
        engine: ua.engine,
        os: ua.os,
      },
    },
  }
  return accessSession
}
