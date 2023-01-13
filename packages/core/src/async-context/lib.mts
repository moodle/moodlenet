import assert from 'assert'
import { AsyncLocalStorage } from 'async_hooks'
import { pkgMeta } from '../common/meta.mjs'
import { PkgIdentifier } from '../types.mjs'
import { ApiCtx, CoreAsyncCtx } from './types.mjs'

export const asyncContext = new AsyncLocalStorage<ApiCtx>()

export function pkgAsyncContext<T>(pkgName: string) {
  return pkgMeta<T>(pkgName, getApiContextStore)

  function getApiContextStore() {
    const currentStore = asyncContext.getStore()
    assert(currentStore, 'cannot get apiContext, currently not in an api call async context')
    return currentStore
  }
}

export const getSetCoreAsyncContext = await pkgAsyncContext<CoreAsyncCtx>(`@moodlenet/core`)

export function assertCallInitiator() {
  const initiator = getCallInitiator()
  assert(initiator, 'no async call initiator !')
  return initiator
}

export function getCallInitiator() {
  const initiator = getSetCoreAsyncContext.get()?.initiator
  return initiator
}

export function pkgInitiateCall<R>(initiator: PkgIdentifier, exec: () => Promise<R>): Promise<R> {
  return asyncContext.run({}, () => {
    getSetCoreAsyncContext.set(_ => ({ ..._, initiator }))
    return exec()
  })
}
