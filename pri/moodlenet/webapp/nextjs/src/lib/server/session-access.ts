import { http_bind } from '@moodle/bindings-node'
import { createAcccessProxy, Modules, primary_session } from '@moodle/domain'
import type {} from '@moodle/mod-iam'
import type {} from '@moodle/mod-net'
import type {} from '@moodle/mod-net-webapp-nextjs'
import { headers } from 'next/headers'
import { userAgent } from 'next/server'
import assert from 'node:assert'
import { getAuthToken } from './auth'

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

  // console.log(inspect({ primarySession }, true, 10, true))

  return ap.mod
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
    authToken: getAuthToken(),
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
    domain: {
      host,
      // FIXME: set basePath,
      // FIXME: set path,
    },
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
