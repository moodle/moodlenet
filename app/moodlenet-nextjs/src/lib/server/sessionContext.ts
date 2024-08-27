'use server'
import { moodle_domain, MoodleDomain, priAccess } from '@moodle/core/domain'
import getTransport /* , { __removeme_a } */ from '@moodle/core/transport'
import { getAuthToken } from './auth'
import { headers } from 'next/headers'
import { userAgent } from 'next/server'
import assert from 'assert'
// __removeme_a('mnetapp')
//  export const asyncCtx = new AsyncLocalStorage<SessionContext>()

const _sessionAccess_p = getTransport('sessionAccess', 'http::localhost:8100')
export async function getAccess(): Promise<priAccess> {
  const sessionAccess = await _sessionAccess_p
  // ('moodlenet', headers(), cookies().get('auth-token'))
  // const X_CONTEXT_FACTORY_LOC = 'x-context-factory-loc'
  // const ctxLoc = process.env[X_CONTEXT_FACTORY_LOC]
  // return (ctxLoc ? await import(ctxLoc) : await import('#server/context-mock')).default[k]
  // return (await import('#lib/mock/server/session-ctx/mock')).default()
  //  console.log('--- getStore', asyncCtx.getStore())
  //  return (
  //    asyncCtx.getStore() ??
  //    (() => {
  //      throw new Error('NO SessionStorage in AsyncLocalContext')
  //    })()
  //  )

  const _headers = headers()
  const host = _headers.get('host')
  assert(host, 'No host in headers')
  return sessionAccess({
    mod: { name: 'moodlenet-nextjs', version: '1.0' },
    host,
    authToken: getAuthToken(),
    protoMeta: {
      proto: 'http',
      userAgent: userAgent({ headers: _headers }),
    },
  })
}
