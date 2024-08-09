'use server'

import { ServerContext } from './types/context'

export async function getCtx(): Promise<ServerContext> {
  // const X_CONTEXT_FACTORY_LOC = 'x-context-factory-loc'
  // const ctxLoc = process.env[X_CONTEXT_FACTORY_LOC]
  // return (ctxLoc ? await import(ctxLoc) : await import('#server/context-mock')).default[k]
  return (await import('@/lib-mock/server/context-mock')).default()
}
