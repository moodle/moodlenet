import type { ApiDefPaths, ApiFnType, PkgConnection } from '@moodlenet/core'
import type { HttpApiResponse } from '@moodlenet/http-server'
import { getPkgApiFetchOpts } from '@moodlenet/http-server/lib/ext-ports-app/pub-lib.mjs'

export type Opts = {}

export function pkgApis<C extends PkgConnection<any>>(connection: C): LocateApi<C> {
  const locateApi = (
    path: string,
    // { ctx = {} }: { ctx?: FloorApiCtx },
  ) => {
    const callApi: ApiFnType<any, any> = async (...args: any[]) => {
      const { requestInit, url } = getPkgApiFetchOpts(connection.pkgId, path, args)
      const response = await fetch(url, requestInit)

      if (response.status !== 200) {
        throw new Error(await response.text())
      }
      const body: HttpApiResponse = await response.json()
      return body.response
    }
    return callApi
  }
  return locateApi as LocateApi<C>
}

export type LocateApi<C extends PkgConnection<any>> = C extends PkgConnection<infer _ApiDefs>
  ? <Path extends ApiDefPaths<_ApiDefs>>(
      path: Path,
      // { ctx = {} }: { ctx?: FloorApiCtx },
    ) => ApiFnType<_ApiDefs, Path>
  : never
