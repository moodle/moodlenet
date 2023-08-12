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

type PendingRpcItem = [Promise<any>, PendingRpcHandle]
const pendingRpcs = new Map<string, PendingRpcItem>()
export function abortRpc(id: string) {
  const [, handle] = pendingRpcs.get(id) ?? []
  if (!handle) return false
  handle.controller.abort()
  return true
}
export function pkgRpcs<TargetPkgRpcDefs extends PkgRpcDefs>(
  targetPkgId: PkgIdentifier,
  userPkgId: PkgIdentifier,
  //rpcPaths: string[],
): PkgRpcHandle<TargetPkgRpcDefs> {
  const locateRpc: PkgRpcHandle<any> = (path, opts) => (body: any, params: any, query: any) => {
    const rpcId = opts?.rpcId ?? Math.random().toString(36).slice(2)
    abortRpc(rpcId)
    const controller = new AbortController()
    const pendingPromise = (async () => {
      const { requestInit, url } = getPkgRpcFetchOpts(userPkgId, targetPkgId, path as string, [
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

    const pendingRpcItem: PendingRpcItem = [pendingPromise, { controller }]
    pendingRpcs.set(rpcId, pendingRpcItem)

    pendingPromise
      .catch(() => void 0)
      .finally(() => {
        if (pendingRpcs.get(rpcId) === pendingRpcItem) {
          pendingRpcs.delete(rpcId)
        }
      })

    return pendingPromise
  }
  return locateRpc
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
  opts?: RpcOpts,
) => TargetPkgRpcDefs[Path]
type RpcOpts = {
  rpcId?: string
}
