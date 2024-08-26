'use server'
import getApiTransport /* , { __removeme_a } */ from '@moodle/core/transport'
import { SessionContext } from './session/types/context'
// __removeme_a('mnetapp')

//  export const asyncCtx = new AsyncLocalStorage<SessionContext>()

const _apiTransport_p = getApiTransport('sessionAccess', 'http::localhost:8100')
export async function sessionContext(): Promise<SessionContext> {
  const apiTransport = await _apiTransport_p
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

  // @ts-expect-error dlsdspd
  const f = await apiTransport({
    authToken: 'tok',
    domain: 'domain',
    protocol: 'proto',
    mod: { name: 'mod name', version: '1' },
  })
  // @ts-expect-error dlsdspd
  f('moo', 'ch', 'msg', { p: 'load' })

  return (await import('../../lib/mock/server/session-ctx/mock')).default()
}
