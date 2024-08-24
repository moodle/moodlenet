import { SessionContext } from './session/types/context'

//  export const asyncCtx = new AsyncLocalStorage<SessionContext>()
export const asyncCtx = new AsyncLocalStorage<any>()

export async function sessionContext(): Promise<SessionContext> {
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
  return (await import('@/lib/mock/server/session-ctx/mock')).default()
}
