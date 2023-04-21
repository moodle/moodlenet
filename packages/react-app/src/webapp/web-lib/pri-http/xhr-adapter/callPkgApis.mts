import type { PkgExposeDef, PkgIdentifier } from '@moodlenet/core'
import { getPkgRpcFetchOpts } from '@moodlenet/http-server/common'
import type { UsePkgHandle } from '../../../types/plugins.mjs'

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

export function getUsePkgHandle<TargetPkgExposeDef extends PkgExposeDef>({
  targetPkgId,
  userPkgId,
  rpcPaths,
}: {
  targetPkgId: PkgIdentifier
  userPkgId: PkgIdentifier
  rpcPaths: string[]
}): UsePkgHandle<TargetPkgExposeDef> {
  return {
    pkgId: userPkgId,
    rpc: pkgRpcs(targetPkgId, userPkgId, rpcPaths),
  }
}

function UNIMPLEMENTED_OR_REVIEW_RPC_FN(UNIMPL_TYPE: 'REVIEW' | 'TO IMPLEMENT') {
  return function (name: string) {
    const mockRpcFn = <R = void, B = void, P = void, Q = void>(
      mock: (body: B, params: P, query: Q) => Promise<R>,
    ) => {
      const rpc = (body: B, params: P, query: Q): Promise<R> => {
        const line = '*'.repeat(50)
        console.error(`
${line}
****  DEV BEWARE RPC [${name}] : ${UNIMPL_TYPE}
${line}
`)
        return mock(body, params, query)
      }
      return rpc
    }
    return mockRpcFn
  }
}

export function pkgRpcs<TargetPkgExposeDef extends PkgExposeDef>(
  targetPkgId: PkgIdentifier,
  userPkgId: PkgIdentifier,
  rpcPaths: string[],
): PkgRpcHandle<TargetPkgExposeDef> {
  return rpcPaths.reduce(
    (_rpc, path) => ({
      ..._rpc,
      [path]: locateRpc(path),
      [`$_DEV_REVIEW_$_${path}`]: UNIMPLEMENTED_OR_REVIEW_RPC_FN('REVIEW')(path),
    }),
    {
      $_DEV_$_TO_IMPLEMENT: UNIMPLEMENTED_OR_REVIEW_RPC_FN('TO IMPLEMENT'),
    } as PkgRpcHandle<TargetPkgExposeDef>,
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

export type PkgRpcHandle<TargetPkgExposeDef extends PkgExposeDef> = LocateRpc<TargetPkgExposeDef> &
  ReviewLocateRpc<TargetPkgExposeDef>

export type LocateRpc<TargetPkgExposeDef extends PkgExposeDef> = {
  [path in keyof TargetPkgExposeDef['rpc']]: TargetPkgExposeDef['rpc'][path]
}

export type ReviewLocateRpc<TargetPkgExposeDef extends PkgExposeDef> = {
  [path in `$_DEV_REVIEW_$_${string & keyof TargetPkgExposeDef['rpc']}`]: ReturnType<
    ReturnType<typeof UNIMPLEMENTED_OR_REVIEW_RPC_FN>
  >
} & {
  $_DEV_$_TO_IMPLEMENT: ReturnType<typeof UNIMPLEMENTED_OR_REVIEW_RPC_FN>
}
