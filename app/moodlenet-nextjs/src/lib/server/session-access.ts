'use server'
import { priAccess, PrimarySession } from '@moodle/domain'
import { getTransport } from '@moodle/msg/bindings/node'
import { headers } from 'next/headers'
import { userAgent } from 'next/server'
import assert from 'node:assert'
import { inspect } from 'node:util'
import { getAuthToken } from './auth'

const TRANSPORT_CGF_ENV_VAR = 'MOODLE_NET_NEXTJS_TRANSPORT_CGF'
const APP_NAME_ENV_VAR = 'MOODLE_NET_NEXTJS_APP_NAME'
const transportCfg = process.env[TRANSPORT_CGF_ENV_VAR] ?? 'http::http://localhost:8100'
const _sessionAccess_p = getTransport('sessionAccess', transportCfg)
export async function getAccess(): Promise<priAccess> {
  const sessionAccess = await _sessionAccess_p
  const _headers = headers()
  const host = _headers.get('host')
  const ip = _headers.get('x-ip') ?? undefined
  const url = _headers.get('x-url') ?? undefined

  const geo_header_str = _headers.get('x-geo') ?? undefined
  const geo = geo_header_str ? JSON.parse(geo_header_str) : undefined
  const ua = userAgent({ headers: _headers })
  assert(host, 'No host in headers')
  const primarySession: PrimarySession = {
    app: { name: APP_NAME_ENV_VAR, pkg: 'moodlenet-nextjs', version: '0.1' },
    host,
    authToken: getAuthToken(),
    meta: {
      proto: 'http',
      ua,
      geo,
      ip,
      url,
    },
  }
  console.log(inspect({ primarySession }, true, 10, true))
  return sessionAccess(primarySession)
}
