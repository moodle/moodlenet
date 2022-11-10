import type { ApiDefPaths, ApiFnType, PkgIdentifier } from '@moodlenet/core'
import type { HttpApiResponse } from '@moodlenet/http-server'
import { getPkgApiFetchOpts } from '@moodlenet/http-server/lib/ext-ports-app/pub-lib.mjs'

export type Opts = Record<string, never>

export function pkgApis<PkgId extends PkgIdentifier>(pkgId: PkgId): LocateApi<PkgId> {
  const locateApi = (
    path: string,
    // { ctx = {} }: { ctx?: FloorApiCtx },
  ) => {
    const callApi: ApiFnType<any, any> = async (...args: any[]) => {
      const { requestInit, url } = getPkgApiFetchOpts(pkgId, path, args)
      const response = await fetch(url, requestInit)

      if (response.status !== 200) {
        throw new Error(await response.text())
      }
      const body: HttpApiResponse = await response.json()
      return body.response
    }
    return callApi
  }
  return locateApi as LocateApi<PkgId>
}

export type LocateApi<PkgId extends PkgIdentifier> = PkgId extends PkgIdentifier<infer PkgConnDef>
  ? <Path extends ApiDefPaths<PkgConnDef['apis']>>(
      path: Path,
      // { ctx = {} }: { ctx?: FloorApiCtx },
    ) => ApiFnType<PkgConnDef['apis'], Path>
  : never
