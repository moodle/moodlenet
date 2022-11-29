import type { PkgIdentifier } from '@moodlenet/core'
export * from '../types.mjs'
export const SESSION_TOKEN_COOKIE_NAME = 'mn-session'
export const BASE_APIS_URL = '/.apis'
export const BASE_PKG_MOUNT_URL = '/.pkg'

// export type RawSubOpts<Def extends ExtDef, Path extends SubcriptionPaths<Def>> = {
//   method: 'POST'
//   path: `${RawSubPriMsgBaseUrl}/${ExtName<Def>}/${ExtVersion<Def>}/${Path}`
//   req: SubcriptionReq<Def, Path>
//   obsType: SubcriptionVal<Def, Path>
//   headers: RawSubOptsHeaders
// }

// export type RawSubOptsHeaders = {
//   'content-type': 'application/json'
// }
export function getPkgApiFetchOpts(pkgId: PkgIdentifier, apiPath: string, args?: any[]) {
  // console.log('appapppa')
  const url = `${BASE_APIS_URL}/${pkgId.name}/${pkgId.version}/${apiPath}`
  const requestInit: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ args }),
  }
  return { url, requestInit }
}
