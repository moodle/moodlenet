import type { PkgIdentifier, PkgRpcDefs } from '@moodlenet/core'
import { getPkgRpcFetchOpts } from '@moodlenet/http-server/common'

export type Opts = Record<string, never>

export type FetchWrapper = (
  url: string,
  requestInit: RequestInit,
  next: FetchWrapper2,
) => Promise<Response>
export type FetchWrapper2 = (url: string, requestInit: RequestInit) => Promise<Response>

const FETCH_WRAPPERS: { wrapper: FetchWrapper }[] = []
export function wrapFetch(wrapper: FetchWrapper) {
  FETCH_WRAPPERS.push({ wrapper })
}

// const FETCH_STATUS_SYM = Symbol('FETCH_STATUS_SYM')
type PendingRpcHandle = { controller: AbortController }

const pendingRpcs = new Map<Promise<any>, PendingRpcHandle>()
export function abortRpc(p: Promise<any>) {
  const handle = pendingRpcs.get(p)
  // console.log('abortRpc', p, handle)
  if (!handle) return false
  handle.controller.abort()
  return true
}
export function pkgRpcs<TargetPkgRpcDefs extends PkgRpcDefs>(
  targetPkgId: PkgIdentifier,
  userPkgId: PkgIdentifier,
  //rpcPaths: string[],
): PkgRpcHandle<TargetPkgRpcDefs> {
  return locateRpc as PkgRpcHandle<TargetPkgRpcDefs>

  function locateRpc(path: string) {
    return function (body: unknown, params: unknown, query: unknown) {
      const controller = new AbortController()
      const pendingPromise = (async () => {
        const { requestInit, url } = getPkgRpcFetchOpts(userPkgId, targetPkgId, path, [
          body,
          params,
          query,
        ])
        const fetchExecutor: FetchWrapper2 = (url, requestInit) =>
          fetch(url, { ...requestInit, signal: controller.signal })
        const response = await FETCH_WRAPPERS.reduce<FetchWrapper2>((nextWrapper, { wrapper }) => {
          const currentWrapper: FetchWrapper2 = (url, requestInit) =>
            wrapper(url, requestInit, nextWrapper)
          return currentWrapper
        }, fetchExecutor)(url, requestInit)

        const responseText = await response.text()
        if (response.status !== 200) {
          throw new Error(responseText)
        }
        const rpcResponse = !responseText ? undefined : JSON.parse(responseText)

        return rpcResponse
      })()

      pendingRpcs.set(pendingPromise, { controller })
      pendingPromise.finally(() => pendingRpcs.delete(pendingPromise)).catch(() => void 0)

      return pendingPromise
    }
  }
}
// function setPendingRpcHandler(p: any, handler: PendingRpcHandler) {
//   p[FETCH_STATUS_SYM] = handler
// }
// function getPendingRpcHandler(p: any): undefined | PendingRpcHandler {
//   return p[FETCH_STATUS_SYM]
// }

export type PkgRpcHandle<TargetPkgRpcDefs extends PkgRpcDefs> = <
  Path extends keyof TargetPkgRpcDefs,
>(
  path: Path,
) => TargetPkgRpcDefs[Path]
