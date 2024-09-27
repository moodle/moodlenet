import { http_bind } from '@moodle/bindings-node'
import { createAcccessProxy, Modules, access_session } from '@moodle/lib-ddd'
import type {} from '@moodle/mod-iam'
import { isAdminUserSession, isAuthenticatedUserSession } from '@moodle/mod-iam/v1_0/lib'
import type {} from '@moodle/mod-net'
import type {} from '@moodle/mod-net-webapp-nextjs'
import type {} from '@moodle/mod-org'
import i18next from 'i18next'
import { headers } from 'next/headers'
import { redirect, RedirectType } from 'next/navigation'
import { userAgent } from 'next/server'
import assert from 'node:assert'
import { sitepaths } from '../common/utils/sitepaths'
import { getAuthTokenCookie } from './auth'

const MOODLE_NET_NEXTJS_PRIMARY_ENDPOINT_URL = process.env.MOODLE_NET_NEXTJS_PRIMARY_ENDPOINT_URL
const MOODLE_NET_NEXTJS_APP_NAME =
  process.env.MOODLE_NET_NEXTJS_APP_NAME ?? 'webapp-moodlenet-nextjs'

const requestTarget = MOODLE_NET_NEXTJS_PRIMARY_ENDPOINT_URL ?? 'http://localhost:8000'

export function priAccess(): Modules {
  const trnspClient = http_bind.client()
  const accessSession = getAccessSession()
  const ap = createAcccessProxy({
    access({ domain_msg }) {
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
  //   const [valid, info] = iam_v1_0.noValidationParseUserSessionToken(
  //     accessSession.sessionToken,
  //   )
  //   if (valid && !info.expired && info.expires.inSecs < 5 * 60) {
  //     !! VALIDATE IT BEFORE REFRESHING !!
  //     ap.mod.moodle.iam_v1_0_lib.pri.session
  //       .generateSession({ userId: info.userData.id })
  //       .then(([generated, session]) => {
  //         if (!generated) {
  //           return
  //         }
  //         setAuthTokenCookie(session)
  //       })
  //   }
  // }

  return ap.mod
}

export async function getUserSession() {
  const { userSession } = await priAccess().moodle.iam.v1_0.pri.session.getCurrentUserSession()
  return userSession
}

export async function getAuthenticatedUserSessionOrRedirectToLogin() {
  const maybe_authenticatedUserSession = await getUserSession()
  if (isAuthenticatedUserSession(maybe_authenticatedUserSession)) {
    return maybe_authenticatedUserSession
  }

  const loginUrl = sitepaths().pages.access.login({
    redirect: headers().get('x-pathname') ?? sitepaths().pages.landing,
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

function getAccessSession() {
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
    sessionToken: getAuthTokenCookie().sessionToken,
    app: {
      name: MOODLE_NET_NEXTJS_APP_NAME,
      pkg: 'webapp-moodlenet-nextjs',
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
