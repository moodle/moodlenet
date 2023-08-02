import type { PkgIdentifier, PkgRpcDefs } from '@moodlenet/core'
import { getPkgRpcFetchOpts } from '@moodlenet/http-server/common'
import type { NormalOption } from 'object-hash'
import objHash from 'object-hash'

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

export type RpcOpts = {
  idOpts?: NormalOption
  ctx?: string
  cache?: {
    ttlSec?: number
  }
  singleton?: boolean
  confirmUnload?: boolean
}

const cache: Record<string, { rpcResponse: any }> = {}
const FETCH_STATUS_SYM = Symbol('FETCH_STATUS_SYM')
const pendingRequests: Record<
  string,
  { pendingPromise: Promise<any>; controller: AbortController; rpcOpts?: RpcOpts }
> = {}
window.addEventListener('beforeunload', e => {
  if (Object.values(pendingRequests).filter(({ rpcOpts }) => !!rpcOpts?.confirmUnload).length) {
    e.preventDefault()
    e.returnValue = 'You have pending requests. if you leave now you may loose some of your job.'
    return e.returnValue
  }
  return
})

export function abortRpc(p: Promise<any>) {
  const found = Object.entries(pendingRequests).find(([_, req]) => req.pendingPromise === p)
  if (!found) return false
  const [id, pending] = found
  if (pending.controller.signal.aborted) return false
  pending.controller.abort()
  delete pendingRequests[id]
  return true
}
export function pkgRpcs<TargetPkgRpcDefs extends PkgRpcDefs>(
  targetPkgId: PkgIdentifier,
  userPkgId: PkgIdentifier,
  //rpcPaths: string[],
): PkgRpcHandle<TargetPkgRpcDefs> {
  return locateRpc as PkgRpcHandle<TargetPkgRpcDefs>

  function locateRpc(path: string, opts?: RpcOpts) {
    return async function (body: unknown, params: unknown, query: unknown) {
      const controller = new AbortController()

      const hash = rpcHash(path, body, params, query, opts)
      if (opts?.singleton) {
        pendingRequests[hash]?.controller.abort()
        delete pendingRequests[hash]
      }
      const cached = cache[hash]
      if (cached) {
        return cached.rpcResponse
      }
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
        if (opts?.cache) {
          cache[hash] = { rpcResponse }
          if (opts.cache.ttlSec) {
            setTimeout(() => delete cache[hash], opts.cache.ttlSec * 1000)
          }
        }

        return rpcResponse
      })()

      const currentPending =
        ((pendingPromise as any)[FETCH_STATUS_SYM] =
        pendingRequests[hash] =
          { controller, pendingPromise, rpcOpts: opts })

      pendingPromise
        .catch(() => void 0)
        .finally(() => {
          if (pendingRequests[hash] === currentPending) {
            delete pendingRequests[hash]
          }
        })

      return pendingPromise
    }
  }

  function rpcHash(
    path: string,
    body: unknown,
    params: unknown,
    query: unknown,
    opts: RpcOpts | undefined,
  ) {
    return objHash({ path, body, params, query, ctx: opts?.ctx }, opts?.idOpts)
  }
}

export type PkgRpcHandle<TargetPkgRpcDefs extends PkgRpcDefs> = <
  Path extends keyof TargetPkgRpcDefs,
>(
  path: Path,
  opts?: RpcOpts,
) => TargetPkgRpcDefs[Path]
