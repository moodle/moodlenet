import assert from 'assert'
import { AsyncLocalStorage } from 'async_hooks'
import type { ApiCtx, CoreAsyncCtx } from './types.mjs'

export const mainAsyncContext = new AsyncLocalStorage<ApiCtx>()

export function pkgAsyncContext<T>(pkgName: string) {
  return { set, unset, get }

  function unset() {
    set(() => undefined)
  }
  function set(setter: (current: T | undefined) => T | undefined): T | undefined {
    const currentStore = assertMainContextStore()
    const nextVal = setter(get())
    currentStore[pkgName] = nextVal
    return nextVal
  }
  function get(): T | undefined {
    const currentStore = assertMainContextStore()
    return currentStore[pkgName] as T | undefined
  }

  function assertMainContextStore() {
    const currentStore = mainAsyncContext.getStore()
    assert(currentStore, `cannot get mainAsyncContext, currently not in an api call async context`)
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

export function setNow(now: Date | number) {
  getSetCoreAsyncContext.set(coreCtx => {
    const deltaNow = Number(now) - Number(new Date())
    return {
      ...coreCtx,
      deltaNow,
    }
  })
}

export function now() {
  const realNowTs = Number(new Date())
  const deltaNow = getSetCoreAsyncContext.get()?.deltaNow ?? 0
  const now = new Date(realNowTs + deltaNow)
  return now
}

// export function pkgInitiateCall<R>(pkgId: PkgIdentifier, exec: () => Promise<R>): Promise<R> {
//   return asyncContext.run({}, () => {
//     getSetCoreAsyncContext.set(_ => ({ ..._, initiator: { pkgId } }))
//     return exec()
//   })
// }
