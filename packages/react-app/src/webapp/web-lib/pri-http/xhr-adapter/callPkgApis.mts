import type { PkgExpose, PkgIdentifier } from '@moodlenet/core'
import type { HttpApiResponse } from '@moodlenet/http-server/lib'
import { getPkgRpcFetchOpts } from '@moodlenet/http-server/lib'
import { UsePkgHandle } from '../../../types/plugins.mjs'

export type Opts = Record<string, never>

export function getUseUsePkgHandle<TargetPkgExpose extends PkgExpose>({
  targetPkgId,
  userPkgId,
}: {
  targetPkgId: PkgIdentifier
  userPkgId: PkgIdentifier
}): UsePkgHandle<TargetPkgExpose> {
  return {
    pkgId: userPkgId,
    rpc: pkgRpcs(targetPkgId, userPkgId),
  }
}

export function pkgRpcs<TargetPkgExpose extends PkgExpose>(
  targetPkgId: PkgIdentifier,
  userPkgId: PkgIdentifier,
): LocateRpc<TargetPkgExpose> {
  return function locateApi(
    path: string,
    // { ctx = {} }: { ctx?: FloorApiCtx },
  ) {
    return async function (body: unknown) {
      const { requestInit, url } = getPkgRpcFetchOpts(userPkgId, targetPkgId, path, [body])
      const response = await fetch(url, requestInit)

      if (response.status !== 200) {
        throw new Error(await response.text())
      }
      const responseJson: HttpApiResponse = await response.json()
      return responseJson.response
    }
  } as LocateRpc<TargetPkgExpose>
}

export type LocateRpc<TargetPkgExpose extends PkgExpose> = <
  Path extends keyof TargetPkgExpose['rpc'],
>(
  path: Path,
) => TargetPkgExpose['rpc'][Path]['fn']
