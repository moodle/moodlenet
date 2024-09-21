import { http_bind } from '@moodle/bindings-node'
import { createAcccessProxy, Modules, primary_session } from '@moodle/lib-ddd'
import type {} from '@moodle/mod-iam'
import { user_session } from '@moodle/mod-iam/v1_0/types'
import type {} from '@moodle/mod-net'
import type {} from '@moodle/mod-net-webapp-nextjs'
import type {} from '@moodle/mod-org'
import { headers } from 'next/headers'
import { userAgent } from 'next/server'
import assert from 'node:assert'
import { getAuthTokenCookie } from './auth'
import i18next from 'i18next'

const MOODLE_NET_NEXTJS_PRIMARY_ENDPOINT_URL = process.env.MOODLE_NET_NEXTJS_PRIMARY_ENDPOINT_URL
const MOODLE_NET_NEXTJS_APP_NAME = process.env.MOODLE_NET_NEXTJS_APP_NAME ?? 'moodlenet-nextjs'

const requestTarget = MOODLE_NET_NEXTJS_PRIMARY_ENDPOINT_URL ?? 'http://localhost:9000'

export function priAccess(): Modules {
  const trnspClient = http_bind.client()
  const primarySession = getPrimarySession()
  const ap = createAcccessProxy({
    access(domain_msg) {
      return trnspClient(
        {
          domain_msg,
          primary_session: primarySession,
          core_mod_id: null,
        },
        requestTarget,
      )
    },
  })
  // FIXME: The following block should refresh the session token before it expires
  // it's not ready as before actually refreshing the token
  // we need to check if the token is actually valid
  // notice `iam_v1_0.noValidationParseUserSessionToken`
  // is fast but do not validate!
  // however we can't set the cookie here :
  // [Error]: Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#cookiessetname-value-options
  //
  // if (primarySession.sessionToken) {
  //   const [valid, info] = iam_v1_0.noValidationParseUserSessionToken(
  //     primarySession.sessionToken,
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
const guest_session: user_session = {
  type: 'guest',
}

export async function getUserSession() {
  const primarySession = getPrimarySession()
  const userSession = primarySession.sessionToken
    ? await priAccess()
        .moodle.iam.v1_0.pri.session.getUserSession({
          sessionToken: primarySession.sessionToken,
        })
        .then(({ userSession }) => userSession)
    : guest_session
  return userSession
}

function getPrimarySession() {
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
  const primarySession: primary_session = {
    type: 'user',
    sessionToken: getAuthTokenCookie(),
    app: {
      name: MOODLE_NET_NEXTJS_APP_NAME,
      pkg: 'moodlenet-nextjs',
      version: '0.1',
    },
    connection: {
      proto: 'http',
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
  return primarySession
}
