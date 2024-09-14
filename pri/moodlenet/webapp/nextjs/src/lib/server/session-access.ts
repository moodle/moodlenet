import { http_bind } from '@moodle/bindings-node'
import { createAcccessProxy, Modules, primary_session } from '@moodle/domain'
import type {} from '@moodle/mod-iam'
import type {} from '@moodle/mod-net'
import type {} from '@moodle/mod-net-webapp-nextjs'
import { headers } from 'next/headers'
import { userAgent } from 'next/server'
import assert from 'node:assert'
import { getAuthTokenCookie, setAuthTokenCookie } from './auth'
import { lib_moodle_iam } from '@moodle/lib-domain'

const REQUEST_TGT_ENV_VAR = 'MOODLE_NET_NEXTJS_REQUEST_TARGET'
const APP_NAME_ENV_VAR = 'MOODLE_NET_NEXTJS_APP_NAME'
const requestTarget = process.env[REQUEST_TGT_ENV_VAR] ?? 'http://localhost:9000'
export function getMod(): Modules {
  const trnspClient = http_bind.client()
  const primarySession = getPrimarySession()
  const ap = createAcccessProxy({
    access(domain_msg) {
      return trnspClient(
        {
          domain_msg,
          primarySession,
          core_mod_id: null,
        },
        requestTarget,
      )
    },
  })
  // FIXME: The following block should refresh the session token before it expires
  // it's not ready as before actually refreshing the token
  // we need to check if the token is actually valid
  // notice `lib_moodle_iam.v1_0.noValidationParseUserSessionToken`
  // is fast but do not validate!
  // however we can't set the cookie here :
  // [Error]: Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#cookiessetname-value-options
  //
  // if (primarySession.sessionToken) {
  //   const [valid, info] = lib_moodle_iam.v1_0.noValidationParseUserSessionToken(
  //     primarySession.sessionToken,
  //   )
  //   if (valid && !info.expired && info.expires.inSecs < 5 * 60) {
  //     !! VALIDATE IT BEFORE REFRESHING !!
  //     ap.mod.moodle.iam.v1_0.pri.session
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
const guest_session: lib_moodle_iam.v1_0.user_session = {
  type: 'guest',
}

export async function getUserSession() {
  const primarySession = getPrimarySession()
  const userSession = primarySession.sessionToken
    ? await getMod()
        .moodle.iam.v1_0.pri.session.getUserSession({
          sessionToken: primarySession.sessionToken,
        })
        .then(({ userSession }) => userSession)
    : guest_session
  return userSession
}

function getPrimarySession() {
  const _headers = headers()
  const host = _headers.get('host')
  const ip = _headers.get('x-ip') ?? undefined
  const url = _headers.get('x-url') ?? undefined
  const mode = _headers.get('x-mode') ?? undefined
  const geo_header_str = _headers.get('x-geo') ?? undefined
  const geo = geo_header_str ? JSON.parse(geo_header_str) : undefined
  const ua = userAgent({ headers: _headers })
  assert(host, 'No host in headers')
  const primarySession: primary_session = {
    type: 'user',
    sessionToken: getAuthTokenCookie(),
    app: {
      name: process.env[APP_NAME_ENV_VAR] ?? 'moodlenet-nextjs',
      pkg: 'moodlenet-nextjs',
      version: '0.1',
    },
    connection: {
      proto: 'http',
      ua: {
        name: ua.ua,
        isBot: ua.isBot,
      },
      ip,
      mode,
      url,
    },
    domain: host,
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
        geo,
        cpu: ua.cpu,
        device: ua.device,
        engine: ua.engine,
        os: ua.os,
      },
    },
  }
  return primarySession
}
