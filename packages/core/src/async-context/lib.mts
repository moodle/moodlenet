import assert from 'assert'
import { AsyncLocalStorage } from 'async_hooks'
import { ApiCtx, CoreAsyncCtx } from './types.mjs'

export const asyncContext = new AsyncLocalStorage<ApiCtx>()

export function pkgAsyncContext<T>(pkgName: string) {
  return { set, unset, get }

  function unset() {
    set(() => undefined)
  }
  function set(setter: (current: T | undefined) => T | undefined): T | undefined {
    const currentStore = getApiContextStore()
    const currentVal = currentStore?.[pkgName] as T | undefined
    const nextVal = setter(currentVal)
    currentStore[pkgName] = nextVal
    return nextVal
  }
  function get(): T | undefined {
    const currentStore = getApiContextStore()
    return currentStore?.[pkgName] as T | undefined
  }

  function getApiContextStore() {
    const currentStore = asyncContext.getStore()
    assert(currentStore, `cannot get apiContext, currently not in an api call async context`)
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

// export function pkgInitiateCall<R>(pkgId: PkgIdentifier, exec: () => Promise<R>): Promise<R> {
//   return asyncContext.run({}, () => {
//     getSetCoreAsyncContext.set(_ => ({ ..._, initiator: { pkgId } }))
//     return exec()
//   })
// }
