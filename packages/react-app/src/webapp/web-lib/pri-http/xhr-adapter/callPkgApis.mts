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
  cache?: {
    ctx?: string
    ttlSec?: number
  }
  replacePending?: boolean
}

const cache: Record<string, { rpcResponse: any }> = {}
const pending: Record<string, { pendingPromise: Promise<any>; controller: AbortController }> = {}
export function pkgRpcs<TargetPkgRpcDefs extends PkgRpcDefs>(
  targetPkgId: PkgIdentifier,
  userPkgId: PkgIdentifier,
  //rpcPaths: string[],
): PkgRpcHandle<TargetPkgRpcDefs> {
  return locateRpc as PkgRpcHandle<TargetPkgRpcDefs>

  function locateRpc(path: string, opts?: RpcOpts) {
    return async function (body: unknown, params: unknown, query: unknown) {
      const controller = new AbortController()

      const hash = objHash({ path, body, params, query, ctx: opts?.cache?.ctx }, opts?.idOpts)
      if (opts?.replacePending) {
        pending[hash]?.controller.abort()
        delete pending[hash]
      }
      const cached = cache[hash]
      if (cached) {
        return cached.rpcResponse
      }
      const pendingPromise = new Promise((resolve, reject) => {
        const { requestInit, url } = getPkgRpcFetchOpts(userPkgId, targetPkgId, path, [
          body,
          params,
          query,
        ])
        const fetchExecutor: FetchWrapper2 = (url, requestInit) =>
          fetch(url, { ...requestInit, signal: controller.signal })
        FETCH_WRAPPERS.reduce<FetchWrapper2>((nextWrapper, { wrapper }) => {
          const currentWrapper: FetchWrapper2 = (url, requestInit) =>
            wrapper(url, requestInit, nextWrapper)
          return currentWrapper
        }, fetchExecutor)(url, requestInit)
          .then(async response => {
            const responseText = await response.text()
            if (response.status !== 200) {
              reject(new Error(responseText))
            }
            const rpcResponse = !responseText ? undefined : JSON.parse(responseText)
            if (opts?.cache) {
              cache[hash] = { rpcResponse }
              if (opts.cache.ttlSec) {
                setTimeout(() => delete cache[hash], opts.cache.ttlSec * 1000)
              }
            }

            resolve(rpcResponse)
          })
          .catch(reject)
      })
      pending[hash] = { controller, pendingPromise }
      pendingPromise.finally(() => {
        delete pending[hash]
      })

      return pendingPromise
    }
  }
}

export type PkgRpcHandle<TargetPkgRpcDefs extends PkgRpcDefs> = <
  Path extends keyof TargetPkgRpcDefs,
>(
  path: Path,
  opts?: RpcOpts,
) => TargetPkgRpcDefs[Path]
