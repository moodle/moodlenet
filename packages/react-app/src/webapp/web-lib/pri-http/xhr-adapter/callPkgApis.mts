import type { PkgExpose, PkgIdentifier } from '@moodlenet/core'
import type { HttpApiResponse } from '@moodlenet/http-server/lib'
import { getPkgRpcFetchOpts } from '@moodlenet/http-server/lib'
import { UsePkgHandle } from '../../../types/plugins.mjs'

export type Opts = Record<string, never>

export function getUseUsePkgHandle<TargetPkgExpose extends PkgExpose>({
  targetPkgId,
  userPkgId,
  rpcPaths,
}: {
  targetPkgId: PkgIdentifier
  userPkgId: PkgIdentifier
  rpcPaths: string[]
}): UsePkgHandle<TargetPkgExpose> {
  return {
    pkgId: userPkgId,
    rpc: pkgRpcs(targetPkgId, userPkgId, rpcPaths),
  }
}

export function pkgRpcs<TargetPkgExpose extends PkgExpose>(
  targetPkgId: PkgIdentifier,
  userPkgId: PkgIdentifier,
  rpcPaths: string[],
): LocateRpc<TargetPkgExpose> {
  rpcPaths.forEach(path => ((locateRpc as any)[path] = locateRpc(path)))
  return locateRpc as LocateRpc<TargetPkgExpose>

  function locateRpc(path: string) {
    return async function (body: unknown) {
      const { requestInit, url } = getPkgRpcFetchOpts(userPkgId, targetPkgId, path, [body])
      const response = await fetch(url, requestInit)

      if (response.status !== 200) {
        throw new Error(await response.text())
      }
      const responseJson: HttpApiResponse = await response.json()
      return responseJson.response
    }
  }
}

export type LocateRpc<TargetPkgExpose extends PkgExpose> = (<
  Path extends keyof TargetPkgExpose['rpc'],
>(
  path: Path,
) => TargetPkgExpose['rpc'][Path]['fn']) & {
  [path in keyof TargetPkgExpose['rpc']]: TargetPkgExpose['rpc'][path]['fn']
}
