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

export function GET_UNIMPLEMENTED_OR_REVIEW_RPC<TargetPkgRpcDefs extends PkgRpcDefs>(
  targetPkgId: PkgIdentifier,
) {
  return UNIMPLEMENTED_OR_REVIEW_RPC
  function UNIMPLEMENTED_OR_REVIEW_RPC<
    R = void,
    B = void,
    P = void,
    Q = void,
    UNIMPL_TYPE extends 'REVIEW' | 'TO IMPLEMENT' = 'TO IMPLEMENT',
  >(
    UNIMPL_TYPE: UNIMPL_TYPE,
    RPC_ENDPOINT: UNIMPL_TYPE extends 'REVIEW' ? keyof TargetPkgRpcDefs : string,
    mockRpcFn: (body: B, params: P, query: Q) => R | Promise<R>,
  ) {
    return async (body: B, params: P, query: Q) => {
      const line = '*'.repeat(50)
      console.error(`
${line}
****  DEV BEWARE ${UNIMPL_TYPE} RPC[${targetPkgId.name}::${String(RPC_ENDPOINT)}]
${line}
`)
      return mockRpcFn(body, params, query)
    }
  }
}

export function pkgRpcs<TargetPkgRpcDefs extends PkgRpcDefs>(
  targetPkgId: PkgIdentifier,
  userPkgId: PkgIdentifier,
  rpcPaths: string[],
): PkgRpcHandle<TargetPkgRpcDefs> {
  return rpcPaths.reduce(
    (_rpc, path) => ({
      ..._rpc,
      [path]: locateRpc(path),
    }),
    {
      '@UNIMPLEMENTED_OR_REVIEW_RPC':
        GET_UNIMPLEMENTED_OR_REVIEW_RPC<TargetPkgRpcDefs>(targetPkgId),
    } as PkgRpcHandle<TargetPkgRpcDefs>,
  )

  function locateRpc(path: string) {
    return async function (body: unknown, params: unknown, query: unknown) {
      const { requestInit, url } = getPkgRpcFetchOpts(userPkgId, targetPkgId, path, [
        body,
        params,
        query,
      ])
      const fetchExecutor: FetchWrapper2 = (url, requestInit) => fetch(url, requestInit)
      const response = await FETCH_WRAPPERS.reduce<FetchWrapper2>((nextWrapper, { wrapper }) => {
        const currentWrapper: FetchWrapper2 = (url, requestInit) =>
          wrapper(url, requestInit, nextWrapper)
        return currentWrapper
      }, fetchExecutor)(url, requestInit)
      const responseText = await response.text()
      if (response.status !== 200) {
        throw new Error(responseText)
      }
      if (!responseText) {
        return undefined
      }
      const responseJson = JSON.parse(responseText)
      return responseJson
    }
  }
}

export type PkgRpcHandle<TargetPkgRpcDefs extends PkgRpcDefs> = LocateRpc<TargetPkgRpcDefs> & {
  '@UNIMPLEMENTED_OR_REVIEW_RPC': ReturnType<
    typeof GET_UNIMPLEMENTED_OR_REVIEW_RPC<TargetPkgRpcDefs>
  >
}

export type LocateRpc<TargetPkgRpcDefs extends PkgRpcDefs> = {
  [path in keyof TargetPkgRpcDefs]: TargetPkgRpcDefs[path]
}
