import assert from 'assert'
import { AsyncLocalStorage } from 'async_hooks'
import { pkgMeta } from '../common/meta.mjs'
import { ensureRegisterPkg } from '../pkg-registry/lib.mjs'
import { PkgIdentifier, PkgModuleRef } from '../types.mjs'
import { ApiCtx, CoreAsyncCtx } from './types.mjs'

export const asyncContext = new AsyncLocalStorage<ApiCtx>()

export async function pkgAsyncContext<T>(pkg_module_ref: PkgModuleRef) {
  const { pkgId } = await ensureRegisterPkg(pkg_module_ref)
  return pkgMeta<T>(pkgId, getApiContextStore)

  function getApiContextStore() {
    const currentStore = asyncContext.getStore()
    assert(currentStore, 'cannot get apiContext, currently not in an api call async context')
    return currentStore
  }
}

export const getSetCoreAsyncContext = await pkgAsyncContext<CoreAsyncCtx>(import.meta)

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
