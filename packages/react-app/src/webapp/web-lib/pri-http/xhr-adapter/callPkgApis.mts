import type { PkgExposeDef, PkgIdentifier } from '@moodlenet/core'
import type { HttpRpcResponse } from '@moodlenet/http-server/common'
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

export function pkgRpcs<TargetPkgExposeDef extends PkgExposeDef>(
  targetPkgId: PkgIdentifier,
  userPkgId: PkgIdentifier,
  rpcPaths: string[],
): LocateRpc<TargetPkgExposeDef> {
  return rpcPaths.reduce(
    (_rpc, path) => ({
      ..._rpc,
      [path]: locateRpc(path),
    }),
    {} as LocateRpc<TargetPkgExposeDef>,
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

      if (response.status !== 200) {
        throw new Error(await response.text())
      }
      const responseJson: HttpRpcResponse = await response.json()
      return responseJson.response
    }
  }
}

export type LocateRpc<TargetPkgExposeDef extends PkgExposeDef> = /* (<
  Path extends keyof TargetPkgExpose['rpc'],
>(
  path: Path,
) =>  TargetPkgExpose['rpc'][Path]['fn']) &  */ {
  [path in keyof TargetPkgExposeDef['rpc']]: TargetPkgExposeDef['rpc'][path]
}
