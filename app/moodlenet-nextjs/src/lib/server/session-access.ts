'use server'
import { priAccess } from '@moodle/core/domain'
import { getTransport } from '@moodle/core/transport'
import { headers } from 'next/headers'
import { userAgent } from 'next/server'
import assert from 'node:assert'
import { getAuthToken } from './auth'

const TRANSPORT_CGF_ENV_VAR = 'MOODLE_NET_NEXTJS_TRANSPORT_CGF'
const transportCfg = process.env[TRANSPORT_CGF_ENV_VAR] ?? 'http::http://localhost:8100'
const _sessionAccess_p = getTransport('sessionAccess', transportCfg)
export async function getAccess(): Promise<priAccess> {
  const sessionAccess = await _sessionAccess_p
  const _headers = headers()
  const host = _headers.get('host')
  assert(host, 'No host in headers')
  return sessionAccess({
    mod: { name: 'moodlenet-nextjs', version: '1.0' },
    host,
    authToken: getAuthToken(),
    meta: {
      proto: 'http',
      userAgent: userAgent({ headers: _headers }),
    },
  })
}
